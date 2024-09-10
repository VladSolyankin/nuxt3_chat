<template>
  <UCard class="w-[50dvw]" :ui="{ body: { padding: 'p-0 sm:p-0' } }">
    <template #header>
      <div class="flex items-center justify-between text-primary">
        <div class="flex items-center gap-x-2">
          <UIcon
            name="i-heroicons-chat-bubble-left-right"
            class="w-6 h-6 font-semibold"
          />
          <div class="text-primary font-semibold text-center text-xl">
            Nuxt Chat
          </div>
        </div>
        <UButton
          @click="() => navigateTo('/')"
          class="bg-primary px-3 py-1.5 text-white cursor-pointer"
        >
          Leave {{ $route.query.room }}
        </UButton>
      </div>
    </template>
    <div class="flex">
      <div class="py-4 px-6">
        <div class="mb-4">
          <div class="flex items-center gap-x-2 mb-2 rounded-md">
            <UIcon
              name="i-heroicons-chat-bubble-bottom-center-text"
              class="w-6 h-6 font-semibold"
            />
            <div class="text-base">Комната</div>
          </div>
          <div class="text-gray-400 hover:font-bold mb-2 capitalize text-base">
            {{ currentRoom }}
          </div>
        </div>
        <div>
          <div class="flex items-center gap-x-2 mb-2 rounded-md">
            <UIcon
              name="i-heroicons-user-group"
              class="w-6 h-6 font-semibold"
            />
            <div class="text-base">Участники ({{ users.length }}):</div>
          </div>
          <div
            v-for="(user, i) in users"
            :key="i"
            class="text-gray-400 hover:font-bold mb-2 capitalize text-base py-1"
            :class="{
              'border-b border-primary': user.username === route.query.username,
            }"
          >
            {{ user.username }}
            <span
              v-if="user.username === route.query.username"
              class="text-primary"
              >(Вы)</span
            >
          </div>
        </div>
      </div>
      <div class="h-96 overflow-y-auto px-8 py-10 flex-1">
        <div
          class="bg-transparent w-full mb-3 flex"
          v-for="(chat, i) in chats"
          :key="i"
          :class="{
            'justify-center': chat.username === 'Системное сообщение',
            'justify-end': chat.username === route.query.username,
            'justify-start': chat.username !== route.query.username,
          }"
        >
          <div
            class="px-6 py-2 w-1/2 rounded-md mb-3"
            :class="{
              'bg-red-400': chat.username === 'Системное сообщение',
              'bg-primary/20': chat.username === route.query.username,
              'bg-green-600': chat.username !== route.query.username,
            }"
          >
            <div class="flex items-center gap-x-3">
              <div class="text-xs text-primary font-semibold">
                {{ chat.username }}
              </div>
              <div class="text-xs">{{ chat.time }}</div>
            </div>
            <div class="mt-1 text-base">
              {{ chat.text }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <form
        @submit.prevent="sendMessage"
        class="flex justify-between items-center m-0 p-0 gap-10"
      >
        <UInput
          class="w-[80%]"
          v-model="message"
          placeholder="Введите сообщение...."
        />
        <UButton
          icon="i-heroicons-paper-airplane"
          size="xs"
          color="primary"
          variant="solid"
          :trailing="false"
          label="Отправить"
          class="w-[100px] px-3 py-1.5 justify-center"
          type="submit"
        />
      </form>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { io, type Socket } from "socket.io-client";
const route = useRoute();

const message = ref("");
const chats = ref<Chat[]>([]);
const users = ref<User[]>([]);
const socket = ref<Socket>();
const currentRoom = ref("");
const sendMessage = async () => {
  socket.value?.emit("chatMessage", message.value);
  await nextTick(() => (message.value = ""));
};
onMounted(() => {
  const { username, room } = route.query as Partial<Chat>;

  socket.value = io({
    path: "/api/socket.io",
  });

  socket.value.emit("joinRoom", { username, room });

  socket.value.on("message", (response: Chat) => {
    chats.value.push(response);
  });

  socket.value.on("roomUsers", (response: { room: string; users: User[] }) => {
    currentRoom.value = response.room;
    users.value = response.users;
  });
});
onBeforeUnmount(() => {
  console.log("Disconnected");
  socket.value?.disconnect();
});
</script>

<style scoped></style>
