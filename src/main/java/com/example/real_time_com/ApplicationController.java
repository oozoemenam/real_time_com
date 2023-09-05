package com.example.real_time_com;

import java.security.Principal;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
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

    @MessageMapping("/message")
    @SendToUser("/queue/message")
    public void message(@Payload String message, @Header(name = "simpSessionId") String sessionId, MessageHeaders messageHeaders, StompHeaderAccessor headerAccessor) {
        System.out.println("/app/message " + sessionRepository.getSessionIds());
        for (String sId : sessionRepository.getSessionIds()) {
            if (!sId.equals(sessionId)) {
                System.out.println("/app/message " + sId + " " + message);
                headerAccessor.setSessionId(sId);
                // headerAccessor.setLeaveMutable(false);
                messagingTemplate.convertAndSendToUser(sId, "/queue/message", message, messageHeaders);
            }
        }
    }

//    @MessageMapping("/signaling")
////    @SendTo("/topic/signaling")
//    public void sendMessage(@Payload String message, @Header(name = "simpSessionId") String sessionId, MessageHeaders messageHeaders, StompHeaderAccessor headerAccessor) {
//        System.out.println("/app/signaling " + sessionRepository.getSessionIds());
////        messagingTemplate.convertAndSendToUser(sessionId, "/queue/signaling", message, messageHeaders);
//        for (String sId : sessionRepository.getSessionIds()) {
//            if (!sId.equals(sessionId)) {
//                System.out.println("/app/signaling " + sId + " " + message);
//                headerAccessor.setSessionId(sId);
//                headerAccessor.setLeaveMutable(false);
//                messagingTemplate.convertAndSendToUser(sId, "/queue/signaling", message, messageHeaders);
//            }
//        }
////        return message;
//    }
//
//    @SubscribeMapping("/signaling")
//    public void subscribe(StompHeaderAccessor headerAccessor, Principal principal, @Header(name = "simpSessionId") String sessionId, MessageHeaders messageHeaders) {
//        // sessions.add
////        String userId = headerAccessor.getFirstNativeHeader("userId");
//         System.out.println(sessionId + "@Subscribe mapping" + messageHeaders + principal);
//        // sessions.add(userId);
//        // messagingTemplate.convertAndSend("/user/" + headerAccessor.getSessionId(), "/topic/signaling");
//        // messagingTemplate.convertAndSendToUser(headerAccessor.getSessionId(), "/topic/signaling");
//        messagingTemplate.convertAndSendToUser(sessionId, "/queue/hello", "Hello", messageHeaders);
//    }
//
//    @MessageMapping("/getHello")
//    public void sendReply( MessageHeaders messageHeaders, @Payload String message, @Header(name = "simpSessionId") String sessionId){
//        messagingTemplate.convertAndSendToUser(sessionId, "/queue/hello", sessionId + message, messageHeaders);
//    }
}
