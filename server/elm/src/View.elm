module View exposing (view)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Model exposing (..)


view : Model -> Browser.Document Msg
view model =
    { title = "Switches"
    , body =
        [ h1 [] [ text "Switches" ]
        , case model.sockets of
            Error ->
                p [] [ text "Error loading switches" ]

            Loading ->
                p [] [ text "Loading switches" ]

            Sockets sockets ->
                ul [ class "sockets" ] (List.map viewSocket sockets)
        , section []
            [ h1 [] [ text "Add a switch" ]
            , viewAddSwitch
            ]
        ]
    }


viewSocket : Socket -> Html Msg
viewSocket socket =
    li [ class "socket" ]
        [ h2 [] [ text ("Socket " ++ (socket.id |> String.fromInt)) ]
        , h3 [] [ text (" is currently " ++ (if socket.switchedOn then "ON" else "OFF")) ]
        , label []
            [ text "Physical socket: "
            , input [ onInput (SocketPhysicalIdChanged socket.id), value socket.physicalId ] []
            ]
        , br [] []
        , label []
            [ text "Description: "
            , input [ onInput (SocketDescriptionChanged socket.id), value socket.description ] []
            ]
        , br [] []
        , button [ onClick (SwitchOn socket) ] [ text "Switch on" ]
        , button [ onClick (SwitchOff socket) ] [ text "Switch off" ]
        , br [] []
        , div [ class "buttons" ]
            [ button [ onClick (ChangeSocket socket) ] [ text "Change" ]
            , text " - "
            , button [ onClick (DeleteSocket socket.id) ] [ text "Delete" ]
            ]
        ]


viewAddSwitch : Html Msg
viewAddSwitch =
    div []
        [ label []
            [ span [] [ text "Description: " ]
            , input [ onInput NewSocketDescriptionChanged ] []
            ]
        , button [ onClick NewSocketAdd ] [ text "Add" ]
        ]
