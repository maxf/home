port module Main exposing (fetchSockets, init, main, removeSocket, socketDecoder, socketsDecoder, subscriptions, update)

import Browser
import Browser.Navigation as Nav
import Http
import Json.Decode exposing (Decoder, bool, float, int, list, map, nullable, string, succeed)
import Json.Decode.Pipeline exposing (required)
import Json.Encode exposing (Value)
import Model exposing (..)
import Time exposing (posixToMillis)
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


port pushMessage : (PushMessage -> msg) -> Sub msg


timestampAsStringDecoder : Decoder (Maybe Int)
timestampAsStringDecoder =
    let
        zeroNothing : String -> Maybe Int
        zeroNothing s =
            case s of
                "0" ->
                    Nothing

                other ->
                    String.toInt s
    in
    map zeroNothing string


socketDecoder : Decoder Socket
socketDecoder =
    succeed Socket
        |> required "id" int
        |> required "description" string
        |> required "physicalSocket" string
        |> required "timerMode" bool
        |> required "switchedOn" bool
        |> required "requestedSwitchedOn" bool
        |> required "realPower" float
        |> required "reactivePower" float
        |> required "frequency" float
        |> required "voltage" float
        |> required "startTime" int
        |> required "stopTime" int
        |> required "random" bool
        |> required "randomBreaks" bool
        |> required "lastMessageReceived" timestampAsStringDecoder


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
                , Http.stringPart "physicalSocket" socket.physicalId
                ]
        , expect = Http.expectWhatever SocketChanged
        , timeout = Nothing
        , tracker = Nothing
        }


switchSocket : Bool -> Socket -> Cmd Msg
switchSocket state socket =
    let
        newState =
            if state then
                "on"

            else
                "off"
    in
    Http.post
        { url = "/set_switch/" ++ socket.physicalId ++ "/" ++ newState
        , body = Http.emptyBody
        , expect = Http.expectWhatever SocketSwitched
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
            ( { model | sockets = Sockets sockets }, Cmd.none )

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

        SocketPhysicalIdChanged id newPhysicalId ->
            case model.sockets of
                Sockets sockets ->
                    let
                        updateSwitch =
                            \x ->
                                if x.id == id then
                                    { x | physicalId = newPhysicalId }

                                else
                                    x

                        newList =
                            List.map updateSwitch sockets
                    in
                    ( { model | sockets = Sockets newList }, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        Switch switchedOn socket ->
            case model.sockets of
                Sockets sockets ->
                    ( { model | sockets = Sockets (modifySocketRequiredSwitchedOn sockets socket switchedOn) }
                    , switchSocket switchedOn socket
                    )

                _ ->
                    ( model, Cmd.none )

        SocketSwitched (Err _) ->
            ( { model | sockets = Error }, Cmd.none )

        SocketSwitched (Ok socket) ->
            ( model, Cmd.none )

        ChangeSocket socket ->
            ( model, changeSocket socket )

        SocketChanged (Err _) ->
            ( { model | sockets = Error }, Cmd.none )

        SocketChanged (Ok _) ->
            ( model, Cmd.none )

        PushReceived message ->
            case model.sockets of
                Sockets sockets ->
                    let
                        updateSwitch =
                            \x ->
                                if x.physicalId == message.deviceId then
                                    { x
                                        | switchedOn = message.records.switchedOn
                                        , lastMessageReceived = Just message.records.updatedAt
                                        , realPower = message.records.realPower
                                        , reactivePower = message.records.reactivePower
                                        , frequency = message.records.frequency
                                        , voltage = message.records.voltage
                                    }

                                else
                                    x

                        newList =
                            List.map updateSwitch sockets
                    in
                    ( { model | sockets = Sockets newList }, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        Tick time ->
            ( { model | lastTick = time |> posixToMillis }
            , Cmd.none
            )

        UserClickedAuto ->
            ( model, Cmd.none )

        UserClickedManual ->
            ( model, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ pushMessage PushReceived
        , Time.every 1000 Tick
        ]


modifySocketRequiredSwitchedOn : List Socket -> Socket -> Bool -> List Socket
modifySocketRequiredSwitchedOn sockets socket value =
    let
        updateSocket s =
            if s == socket then
                { s | requestedSwitchedOn = value }

            else
                s
    in
    List.map updateSocket sockets
