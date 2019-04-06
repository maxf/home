module View exposing (view)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Model exposing (..)
import Time exposing (Month(..), utc, toHour, toMinute, toSecond, millisToPosix, toDay, toMonth, toYear)


view : Model -> Browser.Document Msg
view model =
    { title = "Switches"
    , body =
        [ h1 [] [ text "Switches" ]
        , p [] [ model.lastTick |> toUtcString |> text ]
        , case model.sockets of
            Error ->
                p [] [ text "Error loading switches" ]

            Loading ->
                p [] [ text "Loading switches" ]

            Sockets sockets ->
                ul
                    [ class "sockets" ]
                    (List.map
                         (viewSocket model.lastTick)
                         (List.sortBy .id sockets)
                    )
        , section []
            [ h1 [] [ text "Add a switch" ]
            , viewAddSwitch
            ]
        ]
    }


durationToSaturation : Int -> String
durationToSaturation t =
    let
        secs = 20.0 -- time from 100% to 0% in ms
        tf = toFloat t
    in
        if tf > 1000*secs
        then "0"
        else (100 * ( 1 - tf / (1000*secs))) |> String.fromFloat

viewSocket : Int -> Socket -> Html Msg
viewSocket time socket =
    let
        lastSeen =
            case socket.lastMessageReceived of
                Nothing -> "never"
                Just secs -> secs |> toUtcString
        fadedColor =
            case socket.lastMessageReceived of
                Nothing -> "#000"
                Just secs -> "hsl(120,"++ (durationToSaturation (time-secs)) ++"%,50%)"

    in
    li [ class "socket", style "background" fadedColor ]
        [ h2 [] [ text ("Socket " ++ (socket.id |> String.fromInt)) ]
        , h3 [] [ text (" is currently " ++ (if socket.switchedOn then "ON" else "OFF")) ]
        , p [] [ text ("Last seen: " ++ lastSeen) ]
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



toUtcString : Int -> String
toUtcString time =
    let
        posix =
            millisToPosix time
    in
        String.fromInt (toDay utc posix)
        ++ " " ++
        toEnglishMonth (toMonth utc posix)
        ++ " " ++
        String.fromInt (toYear utc posix)
        ++ " at " ++
        String.fromInt (toHour utc posix)
        ++ ":" ++
        String.fromInt (toMinute utc posix)
        ++ ":" ++
        String.fromInt (toSecond utc posix)
        ++ " (UTC)"


toEnglishMonth : Month -> String
toEnglishMonth month =
  case month of
    Jan -> "Jan"
    Feb -> "Feb"
    Mar -> "Mar"
    Apr -> "Apr"
    May -> "Mai"
    Jun -> "Jun"
    Jul -> "Jul"
    Aug -> "Aug"
    Sep -> "Sep"
    Oct -> "Oct"
    Nov -> "Nov"
    Dec -> "Dec"
