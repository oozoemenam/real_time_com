package com.example.real_time_com;

import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ApplicationController {
    private final SimpMessagingTemplate messagingTemplate;
    private final SessionRepository sessionRepository;

    @GetMapping
    public String index(Model model) {
        return "index";
    }

    @MessageMapping("/signal")
    public void message(@Payload SignalDto message, @Header(name = "simpSessionId") String sessionId, MessageHeaders messageHeaders, StompHeaderAccessor headerAccessor) {
//        System.out.println("/app/signal " + sessionId + message.getToId() + message.getType() + sessionRepository.getSessionIds());
        if (message.getType() == SignalType.OFFER_REQUEST) {
            for (String sId : sessionRepository.getSessionIds()) {
                if (!sId.equals(sessionId)) {
                    System.out.println("/app/signal broadcast " +  sessionId + " " + sId + " " + message.getToId() + " " + message.getType() + " " + sessionRepository.getSessionIds());
                    headerAccessor.setSessionId(sId);
                    messagingTemplate.convertAndSendToUser(sId, "/queue/signal", message, messageHeaders);
                }
            }
        } else {
            System.out.println("/app/signal private " + sessionId + " " + message.getToId() + " " + message.getToId() + " " + message.getType() + " " + sessionRepository.getSessionIds());
            headerAccessor.setSessionId(message.getToId());
            messagingTemplate.convertAndSendToUser(message.getToId(), "/queue/signal", message, messageHeaders);
        }

    }
}
