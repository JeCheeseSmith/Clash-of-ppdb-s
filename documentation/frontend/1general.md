# General Frontend
> This documentation explains the working of the frontend.
>> Please make sure to go through the code for specific explanations of the actual code!

## main

This file is the entry point of the React frontend. See it as the root of the frontend :) It contains the App component (root-component)

## App

To make sure we can navigate from login,signup to the actual game, we use so called "routes". In there we can specify to which component you shall be linked. 

You can be routed towards Login, Signup or the actual mainpage (on which the majority of the game is played)

## mainpage

In this page, all the game components are bound together. See it as a [facade class](https://refactoring.guru/design-patterns/facade)

> We used components to achieve an object-oriented code