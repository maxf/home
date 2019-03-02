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
                ul [] (List.map viewSocket sockets)
        , section []
            [ h1 [] [ text "Add a switch" ]
            , viewAddSwitch
            ]
        ]
    }


viewSocket : Socket -> Html Msg
viewSocket socket =
    li []
        [ "socket: " ++ (socket.id |> String.fromInt) ++ ", " ++ socket.description |> text
        , text " - "
        , button [ onClick (DeleteSocket socket.id) ] [ text "Delete" ]
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
