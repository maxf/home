module Main exposing (fetchSockets, init, main, removeSocket, socketDecoder, socketsDecoder, subscriptions, update)

import Browser
import Browser.Navigation as Nav
import Http
import Json.Decode exposing (Decoder, bool, int, list, string, succeed)
import Json.Decode.Pipeline exposing (required)
import Model exposing (..)
import View exposing (view)



-- MAIN


main : Program () Model Msg
main =
    Browser.document
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- MODEL


socketDecoder : Decoder Socket
socketDecoder =
    succeed Socket
        |> required "id" int
        |> required "description" string
        |> required "physicalSocket" int
        |> required "timerMode" bool
        |> required "switchedOn" bool
        |> required "startTime" int
        |> required "stopTime" int
        |> required "random" bool
        |> required "randomBreaks" bool


socketsDecoder : Decoder (List Socket)
socketsDecoder =
    list socketDecoder


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, fetchSockets )


fetchSockets : Cmd Msg
fetchSockets =
    Http.get
        { url = "/Socket"
        , expect = Http.expectJson SocketsReceived socketsDecoder
        }


changeSocket : Socket -> Cmd Msg
changeSocket socket =
    Http.request
        { method = "PATCH"
        , headers = []
        , url = "/Socket/" ++ String.fromInt socket.id
        , body =
            Http.multipartBody
                [ Http.stringPart "description" socket.description
                , Http.stringPart "switchedOn"
                    (if socket.switchedOn then
                        "true"

                     else
                        "false"
                    )
                ]
        , expect = Http.expectWhatever SocketChanged
        , timeout = Nothing
        , tracker = Nothing
        }


removeSocket : Int -> Cmd Msg
removeSocket id =
    Http.request
        { method = "DELETE"
        , headers = []
        , url = "/Socket/" ++ String.fromInt id
        , body = Http.emptyBody
        , expect = Http.expectWhatever SocketDeleted
        , timeout = Nothing
        , tracker = Nothing
        }


addSocket : NewSocket -> Cmd Msg
addSocket socket =
    Http.post
        { url = "/Socket"
        , body =
            Http.multipartBody
                [ Http.stringPart "description" socket.description
                ]
        , expect = Http.expectJson NewSocketAdded socketDecoder
        }



-- UPDATE


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SocketsReceived (Ok sockets) ->
            let
                newSockets =
                    List.sortBy .id sockets
            in
            ( { model | sockets = Sockets newSockets }, Cmd.none )

        SocketsReceived (Err _) ->
            ( { model | sockets = Error }, Cmd.none )

        DeleteSocket id ->
            case model.sockets of
                Sockets list ->
                    ( { model | sockets = Sockets (List.filter (\s -> s.id /= id) list) }
                    , removeSocket id
                    )

                _ ->
                    ( model, Cmd.none )

        SocketDeleted (Err _) ->
            ( { model | sockets = Error }, Cmd.none )

        SocketDeleted (Ok _) ->
            ( model, Cmd.none )

        NewSocketDescriptionChanged desc ->
            ( { model | newSocket = NewSocket desc }, Cmd.none )

        NewSocketAdd ->
            case model.sockets of
                Loading ->
                    ( model, Cmd.none )

                Error ->
                    ( model, Cmd.none )

                Sockets sockets ->
                    ( model, addSocket model.newSocket )

        NewSocketAdded (Ok newSocket) ->
            case model.sockets of
                Sockets sockets ->
                    ( { model | sockets = Sockets (newSocket :: sockets) }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )

        NewSocketAdded (Err _) ->
            ( model, Cmd.none )

        SocketDescriptionChanged id desc ->
            case model.sockets of
                Sockets sockets ->
                    let
                        updateDesc =
                            \x ->
                                if x.id == id then
                                    { x | description = desc }

                                else
                                    x

                        newList =
                            List.map updateDesc sockets
                    in
                    ( { model | sockets = Sockets newList }, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        SocketStateChanged id ->
            case model.sockets of
                Sockets sockets ->
                    let
                        updateSwitch =
                            \x ->
                                if x.id == id then
                                    { x | switchedOn = not x.switchedOn }

                                else
                                    x

                        newList =
                            List.map updateSwitch sockets
                    in
                    ( { model | sockets = Sockets newList }, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        ChangeSocket socket ->
            ( model, changeSocket socket )

        SocketChanged (Err _) ->
            ( { model | sockets = Error }, Cmd.none )

        SocketChanged (Ok _) ->
            ( model, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none
