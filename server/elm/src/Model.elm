module Model exposing (Model, Socket, Msg(..), RestSockets(..), initialModel, NewSocket)

import Http

type Msg
    = SocketsReceived (Result Http.Error (List Socket))
    | DeleteSocket Int
    | SocketDeleted (Result Http.Error ())
    | NewSocketDescriptionChanged String
    | NewSocketAdd
    | NewSocketAdded (Result Http.Error Socket)
    | SocketDescriptionChanged Int String
    | ChangeSocket Socket
    | SocketChanged (Result Http.Error ())


type alias NewSocket =
    { description: String }

type RestSockets
    = Error
    | Loading
    | Sockets (List Socket)

type alias Model =
    { sockets: RestSockets
    , newSocket: NewSocket
    }

initialModel : Model
initialModel =
    { sockets = Loading
    , newSocket = NewSocket ""
    }


type alias Socket =
    { id : Int
    , description : String
    , physicalSocket : Int
    , timerMode : Bool
    , switchedOn : Bool
    , startTime : Int
    , stopTime : Int
    , random : Bool
    , randomBreaks : Bool
    }
