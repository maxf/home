module Main exposing (..)

import Html exposing (..)
import Html.Events exposing (onClick)
import Maybe exposing (withDefault)

main : Program Never Model Msg
main =
    Html.program
        { view = view
        , init = init
        , update = update
        , subscriptions = \_ -> Sub.none
        }



-- MODEL


type SocketState
    = On
    | Off
    | Unknown


type alias Socket =
    { adapterId : Maybe Int
    , description : Maybe String
    , state : SocketState
    }


type alias Id = Int


type alias Model =
    { sockets : List (Id, Socket)
    , nextId : Id
    }


newSocket : Socket
newSocket =
    Socket Nothing Nothing Unknown



-- INIT


init : ( Model, Cmd Msg )
init =
    ( Model [] 0, Cmd.none )



-- UPDATE


type Msg
    = AddSocket
    | DelSocket Id


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        AddSocket ->
            let
                newModel =
                    { model
                        | nextId = model.nextId + 1
                        , sockets = ( model.nextId + 1, newSocket ) :: model.sockets
                    }
            in
                ( newModel, Cmd.none )

        DelSocket id ->
            let
                socketsMinusSocket =
                    List.filter (\(socketId, _) -> socketId /= id) model.sockets
            in
                ( { model | sockets = socketsMinusSocket }, Cmd.none )



-- VIEW


view : Model -> Html Msg
view model =
    div []
        [ viewControls
        , ul [] (List.map viewSocket model.sockets)
        ]


viewSocket : (Id, Socket) -> Html Msg
viewSocket (id, socket) =
    li []
        [ text (toString id ++ " - " ++ (socket.description |> withDefault "Not set yet"))
        , button [ onClick (DelSocket id) ] [ text "-" ]

        ]


viewControls : Html Msg
viewControls =
    div []
        [ button [ onClick AddSocket ] [ text "+" ]
        ]
