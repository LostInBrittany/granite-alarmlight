[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/LostInBrittany/granite-alarmlight)

# granite-alarmlight

A green-amber-red status indicator custom element

## Doc & demo

[https://lostinbrittany.github.io/granite-alarmlight](https://lostinbrittany.github.io/granite-alarmlight)

## Usage

<!---
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="granite-alarmlight.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
 <granite-alarmlight status="1"></granite-alarmlight>
 <granite-alarmlight status="0"></granite-alarmlight>
 <granite-alarmlight status="-1"></granite-alarmlight>
 <granite-alarmlight status="1" linear></granite-alarmlight>
 <granite-alarmlight status="0.75" linear></granite-alarmlight>
 <granite-alarmlight status="0.5" linear></granite-alarmlight>
 <granite-alarmlight status="0.25" linear></granite-alarmlight>
 <granite-alarmlight status="0" linear></granite-alarmlight>
 <granite-alarmlight ok="-1.0" warn="0.0" ko="1.0" status="0.75" linear></granite-alarmlight>
 <granite-alarmlight ok="-10.0" warn="0.0" ko="10.0" status="7.5" linear></granite-alarmlight>
```

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
