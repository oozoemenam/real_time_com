package com.example.real_time_com;

import lombok.Data;

@Data
public class SignalDto {
    private String fromId;
    private String toId;
    private SignalType type;
    private Object data;
}
