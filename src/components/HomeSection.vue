<script setup lang="ts">

</script>

<template>
    <section class="home">
        <div class="home__content-wrapper">
            <div class="home__content">
                <h1 class="home__title">Мои заметки</h1>
                <p class="home__description">Не забывай о важном, храни его в облаке.</p>
            </div>
        </div>
        <div class="home__image-wrapper">
            <img class="home__image" src="@/assets/img/Hero-img.svg" alt="Заметки в облаке" />
        </div>
    </section>
</template>

<style scoped>
.home {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 40px 20px 0 20px;
    color: #fff;
    min-height: calc(100vh - 96.5px);
}

.home__content-wrapper {
    max-width: 40%;
}

.home__title {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 34px;
    max-width: 500px;
}

.home__description {
    font-size: 18px;
    color: rgb(157, 165, 175);
    font-size: 32px;
    font-weight: 400;
    line-height: 48px;
    letter-spacing: 0%;
    max-width: 394px;
}

.home__image-wrapper {
    max-width: 50%;
}

.home__image {
    max-width: 100%;
    height: auto;
}

@media (max-width: 768px) {
    .home {
        flex-direction: column;
        text-align: center;
    }

    .home__content-wrapper {
        max-width: 80%;
    }

    .home__title {
        font-size: 36px;
    }

    .home__description {
        font-size: 16px;
    }

    .home__image-wrapper {
        max-width: 80%;
    }
}

@media (max-width: 480px) {
    .home {
        padding: 20px;
    }

    .home__content-wrapper {
        max-width: 100%;
    }

    .home__title {
        font-size: 28px;
    }

    .home__description {
        font-size: 14px;
    }

    .home__image-wrapper {
        max-width: 100%;
    }
}

@media (min-width: 1440px) {
    .home__title {   
        font-size: 104px;
        font-weight: 900;
        line-height: 104px;
    }
}
</style>
