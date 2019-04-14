module View exposing (view)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Model exposing (..)
import Time exposing (Month(..), millisToPosix, toDay, toHour, toMinute, toMonth, toSecond, toYear, utc)


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
        secs =
            20.0

        -- time from 100% to 0% in ms
        tf =
            toFloat t
    in
    if tf > 1000 * secs then
        "0"

    else
        (100 * (1 - tf / (1000 * secs))) |> String.fromFloat


durationToOpacity : Int -> Float
durationToOpacity intervalInMs =
    let
        -- milliseconds above which opacity is 0
        threshold =
            20000
    in
    if (Debug.log ">>" intervalInMs) > threshold then
        0

    else
        toFloat (threshold - intervalInMs) / threshold


viewSocket : Int -> Socket -> Html Msg
viewSocket time socket =
    let
        lastSeen =
            case socket.lastMessageReceived of
                Nothing ->
                    "never"

                Just secs ->
                    time - secs |> intervalToString

        fadedColor =
            case socket.lastMessageReceived of
                Nothing ->
                    "#000"

                Just secs ->
                    "hsl(120," ++ durationToSaturation (time - secs) ++ "%,50%)"

        opacity =
            case socket.lastMessageReceived of
                Nothing ->
                    1.0

                Just secs ->
                    durationToOpacity (time - secs)

        status =
            span []
                [ text socket.description
                , text " - "
                , span
                    [ style "color" "green"
                    , style "font-size" "2em"
                    , style "opacity" (String.fromFloat (opacity |> Debug.log ">" ))
                    , title lastSeen
                    ]
                    [ text
                        (if socket.switchedOn then
                            "💡"

                         else
                            "❌"
                        )
                    ]
                , text " - "
                , button [ onClick (SwitchOn socket) ] [ text "ON" ]
                , text " - "
                , button [ onClick (SwitchOff socket) ] [ text "OFF" ]
                ]
    in
    li [ class "socket" ]
        [ details []
            [ summary [] [ status ]
            , ul []
                [ li [] [ text ("Last seen: " ++ lastSeen) ]
                , li [] [ text ("Power: " ++ (socket.realPower |> String.fromFloat)) ]
                , li [] [ text ("Reactive Power: " ++ (socket.reactivePower |> String.fromFloat)) ]
                , li [] [ text ("Frequency: " ++ (socket.frequency |> String.fromFloat)) ]
                , li [] [ text ("Voltage: " ++ (socket.voltage |> String.fromFloat)) ]
                , li []
                    [ text "Description: "
                    , input [ onInput (SocketDescriptionChanged socket.id), value socket.description ] []
                    ]
                , li []
                    [ text "Physical socket: "
                    , input [ onInput (SocketPhysicalIdChanged socket.id), value socket.physicalId ] []
                    ]
                ]
            , div [ class "buttons" ]
                [ button [ onClick (ChangeSocket socket) ] [ text "Change" ]
                , text " - "
                , button [ onClick (DeleteSocket socket.id) ] [ text "Delete" ]
                ]
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
        ++ " "
        ++ toEnglishMonth (toMonth utc posix)
        ++ " "
        ++ String.fromInt (toYear utc posix)
        ++ " at "
        ++ String.fromInt (toHour utc posix)
        ++ ":"
        ++ String.fromInt (toMinute utc posix)
        ++ ":"
        ++ String.fromInt (toSecond utc posix)
        ++ " (UTC)"


toEnglishMonth : Month -> String
toEnglishMonth month =
    case month of
        Jan ->
            "Jan"

        Feb ->
            "Feb"

        Mar ->
            "Mar"

        Apr ->
            "Apr"

        May ->
            "Mai"

        Jun ->
            "Jun"

        Jul ->
            "Jul"

        Aug ->
            "Aug"

        Sep ->
            "Sep"

        Oct ->
            "Oct"

        Nov ->
            "Nov"

        Dec ->
            "Dec"


intervalToString : Int -> String
intervalToString milliseconds =
    let
        seconds =
            milliseconds // 1000

        daysAgo =
            seconds // 3600 // 24

        hoursAgo =
            (seconds - daysAgo * 3600 * 24) // 3600

        minutesAgo =
            (seconds - (daysAgo * 3600 * 24) - (hoursAgo * 3600)) // 60

        secondsAgo =
            seconds - (daysAgo * 3600 * 24) - (hoursAgo * 3600) - (minutesAgo * 60)

        timeAgo =
            (if daysAgo /= 0 then
                String.fromInt daysAgo ++ " days  "

             else
                ""
            )
                ++ (if hoursAgo /= 0 then
                        String.fromInt hoursAgo ++ " hours  "

                    else
                        ""
                   )
                ++ (if minutesAgo /= 0 then
                        String.fromInt minutesAgo ++ " minutes  "

                    else
                        ""
                   )
                ++ (if secondsAgo /= 0 then
                        String.fromInt secondsAgo ++ " seconds"

                    else
                        ""
                   )
    in
    if timeAgo /= "" then
        timeAgo

    else
        "just now"
