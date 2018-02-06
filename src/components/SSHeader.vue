<template>
    <div class="header">
        <div class="header__left">
            <div class="header__logo">
                SS
            </div>
            <div class="header__title">
                SquadSeeker
            </div>
        </div>
        <div class="header__right">
            <div class="header__id">
                {{steamId}}
            </div>
        </div>
    </div>
</template>

<script>
export default {
name: 'SSHeader',
props: ['steamId'],
data () {
    return {
      
    }
  }
}
</script>

<style lang="scss">

.header {
    position: relative;
    height: 60px;
    width: 100%;
    background-color: green;

    &__left {
        float: left;
        display: flex;
        flex-direction: row;
    }

    &__logo {
        margin-left: 5px;
        text-align: left;
        font-size: 50px;
        color: white;
        line-height: 60px;
    }

    &__title {
        margin-left: 30px;
        text-align: left;
        font-size: 30px;
        color: white;
        line-height: 60px;
    }

    &__id {
        float: right;
        color: white;
        font-size: 24px;
        line-height: 60px;
        font-weight: bold;
    }
}

</style>
