module Model exposing (Model, Msg(..), NewSocket, PushMessage, RestSockets(..), Socket, initialModel)

import Http
import Json.Encode exposing (Value)
import Time


type Msg
    = SocketsReceived (Result Http.Error (List Socket))
    | DeleteSocket Int
    | SocketDeleted (Result Http.Error ())
    | NewSocketDescriptionChanged String
    | NewSocketAdd
    | NewSocketAdded (Result Http.Error Socket)
    | SocketDescriptionChanged Int String
    | SocketPhysicalIdChanged Int String
    | Switch Bool Socket
    | SocketSwitched (Result Http.Error ())
    | ChangeSocket Socket
    | SocketChanged (Result Http.Error ())
    | PushReceived PushMessage
    | Tick Time.Posix
    | UserClickedAuto
    | UserClickedManual


type alias PushMessage =
    { deviceId : String
    , records :
        { switchedOn : Bool
        , realPower : Float
        , reactivePower : Float
        , frequency : Float
        , voltage : Float
        , updatedAt : Int
        }
    }


type alias NewSocket =
    { description : String }


type RestSockets
    = Error
    | Loading
    | Sockets (List Socket)


type alias Model =
    { sockets : RestSockets
    , newSocket : NewSocket
    , lastTick : Int
    }


initialModel : Model
initialModel =
    { sockets = Loading
    , newSocket = NewSocket ""
    , lastTick = 0
    }


type alias Socket =
    { id : Int
    , description : String
    , physicalId : String
    , timerMode : Bool
    , switchedOn : Bool
    , requestedSwitchedOn : Bool
    , realPower : Float
    , reactivePower : Float
    , frequency : Float
    , voltage : Float
    , startTime : Int
    , stopTime : Int
    , random : Bool
    , randomBreaks : Bool
    , lastMessageReceived : Maybe Int
    }
