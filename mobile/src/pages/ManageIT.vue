<template>
  <div>
    <div class="pt-8 pl-[21px]">
      <Tab :tabs="tabs" @selected-tab="selectedTab = $event"></Tab>
    </div>
    <div class="pt-5 pl-5 pr-5 pb-5">
      <div v-if="selectedTab === 'Allocation'">
        <Allocation></Allocation>
      </div>
      <div v-else>
        <WorkInstructions></WorkInstructions>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import Tab from '../components/Tab.vue'
import Allocation from './Allocation.vue'
import WorkInstructions from './WorkInstructions.vue'
import { moduleName } from '../data/module'

const tabs = ['Allocation', 'Instruction']
const selectedTab = ref('Allocation')

moduleName.value = 'ManageIT'
</script>
