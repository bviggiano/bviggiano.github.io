---
layout: default
permalink: /notes/
title: notes
nav: true
nav_order: 3
---

A collection of notes on things I've learned that I thought might be helpful for others!

{% for note in site.notes %}
{% assign read_time = note.content | number_of_words | divided_by: 180 | plus: 1 %}

<div style="margin-bottom: 1.5em;">
  <div style="display: flex; align-items: center;">
    {% if note.image %}
    <img src="{{ note.image | relative_url }}" alt="icon" style="height: 2em; width: 2em; object-fit: contain; margin-right: 0.3em;">
    {% else %}
    <span style="font-size: 2em; line-height: 1; margin-right: 0.3em;">{{ note.emoji }}</span>
    {% endif %}
    <span style="font-size: 1.5em; font-weight: bold;"><a href="{{ note.url }}">{{ note.title }}</a></span>
    <span style="margin-left: 0.5em;">| {{ note.description }}</span>
  </div>
  <div style="color: gray; font-size: 0.9em; margin-left: 2.6em;">{{ read_time }} min read</div>
</div>
{% endfor %}

{% if site.notes.size == 0 %}

<p><em>No notes yet.</em></p>
{% endif %}
