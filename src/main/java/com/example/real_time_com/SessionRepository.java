package com.example.real_time_com;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Repository
public class SessionRepository {
    @Getter @Setter private List<String> sessionIds = new CopyOnWriteArrayList<>();

    public void addSessionId(String sessionId) {
        sessionIds.add(sessionId);
    }

    public void removeSessionId(String sessionId) {
        sessionIds.remove(sessionId);
    }
}
