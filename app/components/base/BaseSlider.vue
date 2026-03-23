<template>
  <div class="space-y-3 pt-2">
    <div class="flex justify-between items-center text-[0.6rem] uppercase tracking-widest text-muted">
      <span>{{ label }}</span>
      <span class="font-bold">{{ modelValue }}%</span>
    </div>
    <input class="w-full h-1 bg-surface-variant rounded-full appearance-none cursor-pointer accent-primary-glow" 
           type="range" 
           :value="modelValue" 
           @input="$emit('update:modelValue', $event.target.value)" 
           :min="0" :max="100"/>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  modelValue: { type: [Number, String], required: true }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: #adc6ff;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(173, 198, 255, 0.5);
  transition: all 0.2s ease;
}
input[type=range]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  background: #4b8eff;
  box-shadow: 0 0 15px rgba(75, 142, 255, 0.8);
}
</style>
