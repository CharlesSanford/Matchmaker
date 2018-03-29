<template>
    <v-footer>
        <v-spacer></v-spacer>
        <div>
            &copy; {{ new Date().getFullYear() }} - Charles Sanford - All Rights Reserved.
        </div>
    </v-footer>
</template>

<script>

export default {
    name: 'app-footer',
    data () {
        return {

        }
    },
    methods: {

    }
}
</script>

<style lang="scss">
@import "./src/assets/scss/base";

.footer {
    width: 100%;
    position: relative;
    background-color: $quinary-color;
    height: 100px;

    &__text {
        color: white;
    }
}

</style>
