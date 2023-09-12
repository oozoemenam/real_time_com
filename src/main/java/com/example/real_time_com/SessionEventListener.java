package com.example.real_time_com;

import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;

@Component
@RequiredArgsConstructor
public class SessionEventListener {
  private final SessionRepository sessionRepository;

  @EventListener
  public void handleSessionConnect(SessionConnectEvent event) {
    SimpMessageHeaderAccessor headers = SimpMessageHeaderAccessor.wrap(event.getMessage());
    headers.setLeaveMutable(true);
    System.out.println("Session connect event " + headers.getSessionId());
    sessionRepository.addSessionId(headers.getSessionId());
  }

  @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
      SimpMessageHeaderAccessor headers = SimpMessageHeaderAccessor.wrap(event.getMessage());
      System.out.println("Session disconnect event " + headers.getSessionId());
      sessionRepository.removeSessionId(headers.getSessionId());
  }

  @EventListener
  public void handleSessionSubscribe(SessionSubscribeEvent event) {
    SimpMessageHeaderAccessor headers = SimpMessageHeaderAccessor.wrap(event.getMessage());
    System.out.println("Session subscribe event " + headers.getSessionId());
  }

  @EventListener
    public void handleSessionUnsubscribe(SessionUnsubscribeEvent event) {
      SimpMessageHeaderAccessor headers = SimpMessageHeaderAccessor.wrap(event.getMessage());
      System.out.println("Session unsubscribe event " + headers.getSessionId());
  }
}