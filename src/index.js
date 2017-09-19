/*
            Mathmania

         by David Hayden


A Vue.js app that asks simple math
problems.

The code intentionally avoids using
webpack, vuex, and an event bus.

I wanted to build a Vue.js app using
script templates, the render function,
custom properties, custom events, and
event bubbling.

A last minute change to mark incorrect
guesses as 'red' caused me to add a
few hacks, but I'll leave it as is :)
*/

/*

Child components using script
templates. Script templates offer
more flexibility than DOM
templates and easier to write than
string templates.

I went un-necessarily deep in the
child hierarchy for kicks. Could
have gone deeper by creating a
'Choice' child component.

*/
Header = Vue.component('Header', {
    props: ['title'],
    template: '#appHeader'
});

Footer = Vue.component('Footer', {
    props: ['credits'],
    template: '#appFooter'
});

Quiz = Vue.component('Quiz', {
    props: ['problem', 'done'],
    template: '#appQuiz'
});

Equation = Vue.component('Equation', {
    props: ['equation'],
    template: '#appEquation'
});

Choices = Vue.component('Choices', {
    props: ['choices', 'correctAnswer'],
    data: function () {
        return {
            incorrectAttempts: 0
        }
    },
    methods: {
        answer: function (choice) {
            /* Correct choice chosen. Send the
               number of incorrect guesses so
               the app knows that this problem
               were not correctly guessed the
               first time.
             */
            if (Number(choice.value) === this.correctAnswer) {
                this.$emit('answer', this.incorrectAttempts);
                this.incorrectAttempts = 0;
                return;
            }

            /* If the user guesses incorrectly,
               mark the choice guessed in 'red'
               and let them keep guessing until
               the correct choice is selected.
             */
            this.incorrectAttempts++;
            choice.markIncorrect = true;
        }
    },
    template: '#appChoices'
});

Results = Vue.component('Results', {
    props: ['totalIncorrect', 'totalProblems'],
    template: '#appResults'
});

App = Vue.component('app', {
    data: function () {
        return {
            title: 'Mathmania',
            credits: 'Made with Vue.js by David Hayden',
            problems: [
                {
                    equation: "4 + 5",
                    choices: [
                        {value: 10, markIncorrect: false},
                        {value: 9, markIncorrect: false},
                        {value: 2, markIncorrect: false},
                        {value: 0, markIncorrect: false}
                    ],
                    answer: 9
                },
                {
                    equation: "4 + 3",
                    choices: [
                        {value: 6, markIncorrect: false},
                        {value: 8, markIncorrect: false},
                        {value: 4, markIncorrect: false},
                        {value: 7, markIncorrect: false}
                    ],
                    answer: 7
                },
                {
                    equation: "1 + 5",
                    choices: [
                        {value: 2, markIncorrect: false},
                        {value: 6, markIncorrect: false},
                        {value: 3, markIncorrect: false},
                        {value: 7, markIncorrect: false}
                    ],
                    answer: 6
                }
            ],
            currentIndex: 0,
            totalIncorrect: 0,
            done: false
        }
    },
    computed: {
        problem: function () {
            return this.problems[this.currentIndex];
        },
        totalProblems: function () {
            return this.problems.length;
        }
    },
    methods: {
        answer: function (incorrectAttempts) {
            /* If quiz component is reporting
               incorrect attempts, this problem
               was guessed incorrectly one or
               more times so increment the count.
             */
            if (incorrectAttempts > 0)
                this.totalIncorrect++;

            /* Display the next question or results.
               'done' flag is used with v-if in
               'appContainer' script template to
               toggle between quiz and results.
             */
            if (this.currentIndex < this.totalProblems - 1) {
                this.currentIndex++;
            } else {
                this.done = true; // displays results template
            }
        },
        restart: function () {
            /* Not happy about this O(n^2) operation.
               Decided at last minute to mark incorrect
               answers in red using a hack. Have to
               reset the markIncorrect property of each
               choice that is used to style bootstrap
               button as btn-primary or btn-danger.
            */
            for (var i = 0; i < this.problems.length; i++) {
                for (var j = 0; j < this.problems[i].choices.length; j++) {
                    this.problems[i].choices[j].markIncorrect = false;
                }
            }

            this.currentIndex = 0;
            this.totalIncorrect = 0;
            this.done = false;
        },
    },
    template: '#appContainer'
});

/*

Main Vue instance. Render function
replaces the dom element.

*/

new Vue({
    el: '#mathmania',
    render: function (createElement) {
        return createElement(App);
    }
});
