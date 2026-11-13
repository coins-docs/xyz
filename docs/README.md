---
home: true
title: Coins.xyz API Documentation
heroText: Coins.xyz API Docs
tagline: Complete API documentation for Coins.xyz
actions:
  - text: Get Started with REST API
    link: /rest-api
    type: primary
  - text: WebSocket Streams
    link: /web-socket-streams
    type: secondary
features:
  - title: REST API
    details: Complete REST API documentation with endpoints for trading, account management, and more.
  - title: WebSocket Streams
    details: Real-time market data and order updates via WebSocket connections.
  - title: User Data Stream
    details: Private user data streams for account and order updates.
  - title: Error Codes
    details: Complete list of error codes and troubleshooting information.
footer: Copyright © 2026 Coins.xyz
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  router.push('/rest-api')
})
</script>

## Redirecting to REST API documentation...

If the automatic redirect does not work, click [here](./rest-api.html).
