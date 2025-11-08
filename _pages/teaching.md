---
layout: page
permalink: /teaching/
title: teaching
description: In my time at Stanford, I have taught and helped develop materials for the following courses
nav: true
nav_order: 6
---

<div class="courses">
  {% assign sorted_courses = site.data.courses | sort: "importance" %}

  <div class="row row-cols-1 row-cols-md-4">
    {% for course in sorted_courses %}
      {% include courses.liquid %}
    {% endfor %}
  </div>
</div>
