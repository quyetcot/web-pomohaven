<template>
  <div class="focus-dashboard-layout h-screen flex relative overflow-hidden bg-void text-white">
    <!-- Sidebar (Desktop) -->
    <TheSidebar />
    
    <div class="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0 md:ml-64">
      <!-- Header (Top Nav) -->
      <TheHeader />
      
      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto overflow-x-hidden pt-[76px] lg:pt-0">
        <div class="h-full pt-12 pb-12 px-6 md:px-12 relative flex flex-col gap-y-20">
          <div class="flex-1">
            <slot />
          </div>
          <!-- Footer -->
          <TheFooter />
        </div>
      </main>
    </div>

    <!-- System Audio Player -->
    <AudioContextualPlayer />
    
    <!-- Mobile Navigation -->
    <TheMobileNav />
  </div>
</template>

<script setup>
// Layout Component rỗng tạm thời
</script>
