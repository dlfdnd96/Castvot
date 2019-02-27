package com.castvot.admin.controller;

import java.util.Locale;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(value = "/board")
public class FreeBoardController {

    @RequestMapping(value = "/freeBoard")
    public String freeBoard(Locale locale, Model model) {

        return "board/freeBoard";
    }

}
