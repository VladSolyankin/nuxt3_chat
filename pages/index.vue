<template>
  <div class="w-[40dvw] min-w-[300px]">
    <UCard>
      <template #header>
        <div class="flex items-center justify-center gap-x-3 text-primary">
          <UIcon
            name="i-heroicons-chat-bubble-left-right"
            class="w-9 h-9 font-semibold"
          />
          <div class="text-primary font-semibold text-center text-3xl">
            Nuxt Chat
          </div>
        </div>
      </template>

      <UForm :state="state" @submit="onSubmit" class="space-y-6">
        <UFormGroup label="Username" name="username">
          <UInput v-model="state.username" />
        </UFormGroup>

        <UFormGroup label="Room" name="room">
          <USelect v-model="state.room" :options="rooms" />
        </UFormGroup>

        <UButton
          type="submit"
          size="xl"
          block
          :disabled="!state.username || !state.room"
        >
          Войти в комнату
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
const rooms = ["room 1", "room 2", "room 3"];
const state = reactive({
  username: "",
  room: rooms[0],
});

const onSubmit = () => {
  navigateTo(`/chat?username=${state.username}&room=${state.room}`);
};
</script>

<style scoped></style>
