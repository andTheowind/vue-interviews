<script setup lang="ts">
import { ref, onMounted, defineEmits } from 'vue';
import { useRouter } from 'vue-router'; 
import Cookies from 'js-cookie';
import { BACKEND_URL } from '@/assets/utils/constants/environments';

// функция для закрытия модального окна

const router = useRouter();

// состояние модального окна
const isOpen = ref(false);

// переменные для хранения email и пароля
const email = ref('');
const password = ref('');
const showPassword = ref(false);

// переменная для успешного входа
const loginSuccess = ref('');

// список ошибок
const errorList = ref<string[]>([]);

// определение событий
const emit = defineEmits(['set-actions', 'open-register']);

// функция для открытия модального окна
const openModal = () => { isOpen.value = true; };

// функция для закрытия модального окна
const closeModal = () => { isOpen.value = false; };

const submitLogin = async () => {
    errorList.value = [];
    loginSuccess.value = '';
    try {
        const response = await fetch(`${BACKEND_URL}/api/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        });
        if (!response.ok) {
            const data = await response.json();
            errorList.value = Array.isArray(data.message) ? data.message : [data.message];
        } else {
            const data = await response.json();
             // Сохранение полученного accessToken с помощью js-cookie
            Cookies.set('accessToken', data.accessToken, { path: '/' });
            // Получение данных пользователя с помощью GET api/auth с accessToken в заголовке Authorization
            const authResponse = await fetch(`${BACKEND_URL}/api/auth`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.accessToken}`
                }
            });
            if(authResponse.ok) {
                const userData = await authResponse.json();
                console.log('User data:', userData);
                // ...обработка данных пользователя по мере необходимости...
                // Переход на страницу Заметок после успешного входа и получения данных
                router.push('/notes');
            } else {
                console.error('Не удалось получить данные пользователя');
            }
            loginSuccess.value = "Вы успешно вошли в систему";
        }
    } catch (error) {
        console.error('Ошибка запроса:', error);
    }
};

onMounted(() => {
    emit('set-actions', { open: openModal, close: closeModal });
});
</script>

<template>
    <div class="modal" v-if="isOpen">
        <div class="modal__overlay" @click="closeModal"></div>
        <div class="modal__content">
            <button class="modal__close" @click="closeModal">
                <img src="@/assets/img/close-btn.svg" alt="">
            </button>
            <template v-if="loginSuccess">
                <div class="modal__success-window">
                    <p>{{ loginSuccess }}</p>
                    <button class="modal__button" @click="closeModal">ОК</button>
                </div>
            </template>
            <template v-else>
                <h2 class="modal__title">Вход в ваш аккаунт</h2>
                <form @submit.prevent="submitLogin" class="modal__form">
                    <div class="modal__form-group">
                        <label for="email" class="modal__label">Email</label>
                        <input id="email" type="email" v-model="email" class="modal__input" placeholder="Введите Email" required />
                    </div>
                    <div class="modal__form-group">
                        <label for="password" class="modal__label">Пароль</label>
                        <div class="modal__password-wrapper">
                            <input id="password" :type="showPassword ? 'text' : 'password'" v-model="password" class="modal__input" placeholder="Введите пароль" required />
                        </div>
                    </div>
                    <div class="modal__footer">
                        <div class="modal__footer-row">
                            <p class="modal__signup">
                                У вас нет аккаунта?
                                <a href="#" class="modal__signup-link" @click.prevent="$emit('open-register')">
                                    Зарегистрируйтесь
                                </a>
                            </p>
                            <button type="submit" class="modal__button">Войти</button>
                        </div>
                        <div v-if="errorList.length" class="modal__errors">
                            <ul>
                                <li v-for="(error, index) in errorList" :key="index">{{ error }}</li>
                            </ul>
                        </div>
                    </div>
                </form>
            </template>
        </div>
    </div>
</template>

<style scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
}

.modal__overlay {
    position: absolute;
    width: 100%;
    height: 100%;
}

.modal__content {
    background: #1a2b44;
    padding: 40px;
    border-radius: 40px;
    max-width: 420px;
    color: #fff;
    position: relative;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}

.modal__close {
    position: absolute;
    top: 20px;
    right: 20px;
    background: #a6ce39;
    border: none;
    font-size: 18px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal__title {
    font-size: 38px;
    margin-bottom: 25px;
    font-weight: bold;
}

.modal__form {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.modal__form-group .modal__label {
    display: block;
    margin-bottom: 8px;
    margin-left: 24px;
}

.modal__label {
    font-size: 14px;
    font-weight: 400;
    color: #9DA5AF; 
}

.modal__input {
    padding: 14px 14px 14px 28px;
    border-radius: 28px;
    border: none;
    font-size: 16px;
    background: #fff;
    color: #9DA5AF;
    font-family: "Montserrat", serif;
    width: 100%;
}

.modal__input::placeholder {
    font-family: "Montserrat", serif;
}

.modal__input:focus {
    outline: 1px solid #a6ce39;
}

.modal__password-wrapper {
    position: relative;
    width: 100%;
}

.modal__toggle-password {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
}

.modal__signup {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #9DA5AF;
    text-align: center;
}

.modal__signup-link {
    padding-left: 6px;
    color: #a6ce39;
    font-weight: bold;
    text-decoration: none;
}

.modal__button {
    display: inline-flex;
    justify-content: center;
    background-color: #a6ce39;
    padding: 17px 10px;
    border: none;
    border-radius: 34px;
    font-size: 19px;
    cursor: pointer;
    font-weight: 500;
    letter-spacing: 1px;
    color: #fff;
    width: 100%;
    max-width: 114px;
    transition: background-color 0.35s;
    text-align: center;
}

.modal__button:hover {
    background: #8fbf33;
}

.modal__errors {
    background: rgba(255, 0, 0, 0.2);
    padding: 10px;
    border-radius: 15px;
    text-align: center;
    margin-top: 10px;
}

.modal__error-text {
    color: #ff6b6b;
    font-size: 14px;
}

.modal__footer {
    padding-top: 16px;
}

.modal__errors {
    align-self: flex-start;
}

.modal__errors ul {
    margin-top: 8px;
    padding: 8px 14px 8px 14px;
    font-size: 14px;
    color: #FF7461;
    background-color: rgba(255, 116, 97, 10%);
    border-radius: 24px;
}

.modal__errors ul li {
    list-style-type: none;
}

@media (min-width: 768px) {
    .modal__footer,
    .modal__footer-row {
        display: flex;
    }

    .modal__footer-row {
        width: 100%;
        flex-direction: row;
        align-self: center;
        justify-content: space-between;
    }
}

@media (min-width: 1200px) {
    .modal__title {
        font-size: 52px;
    }

    .modal__input {
        min-width: 380px;
    }
}

@media (min-width: 1440px) {
    .modal__content {
        max-width: 780px;
        padding: 74px 80px 74px 80px;
    }

    .modal__input {
        min-width: 620px;
        padding: 27px 14px 27px 28px;
        border-radius: 36px;
    }
}
</style>