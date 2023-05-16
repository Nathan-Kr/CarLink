<script setup lang="ts">
import { gql } from '@apollo/client/core'
import { useNhostClient, useUserId, useUserData } from '@nhost/vue'
import { useMutation, useSubscription } from '@vue/apollo-composable'
import { computed, ref } from 'vue'

const { nhost } = useNhostClient()

const id = useUserId()

const user = useUserData()
console.log(user)

const firstName = ref('')
const lastName = ref('')

</script>

<template>
  <div>
    <div i-carbon-home text-4xl inline-block />
    <p>Profile page</p>
    <p>
      <em text-sm op75>Quickstart</em>
    </p>
    <div v-if="user" py-4>
      <p my-4>
        Hello, {{ user.displayName }}. Your email is {{ user.email }}.
      </p>
    </div>
  </div>
</template>
