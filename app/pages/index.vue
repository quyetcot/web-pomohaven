<template>
  <div class="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-8">
    <!-- Timer & Central Controller (8 Columns) -->
    <section class="lg:col-span-8 flex flex-col items-center space-y-8">
      <FocusTimerOrb />
      <AudioSanctuaryWidget />
    </section>

    <!-- Sessions & Stats (4 Columns) -->
    <aside class="lg:col-span-4 space-y-6">
      <DashboardHistoryWidget />
      <DashboardStatsWidget />
      
      <!-- Quote of the Day -->
      <div class="p-4 italic text-muted/70 text-center border-t border-muted/10">
        <p class="text-xs font-light tracking-wide">"The secret of getting ahead is getting started."</p>
      </div>
    </aside>
  </div>
</template>

<script setup>
</script>
