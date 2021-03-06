package com.jamesdev.blog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentWriteRequestDto {
    private long userId;
    private long boardId;
    private String content;
}
