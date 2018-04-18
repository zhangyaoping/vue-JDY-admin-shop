<template>
  <div class="dashboard-container">
    <component :is="currentRole"></component>
  </div>
</template>

<script>
  import Dashboard from './Dashboard'
  import editorDashboard from './editor'
  import sessionStorage from '@/storage/sessionStorage'
  export default {
    name: 'dashboard',
    components: { Dashboard, editorDashboard },
    data() {
      return {
        currentRole: 'Dashboard'
      }
    },
  created() {
    this.roleName = decodeURI(sessionStorage.$getSessionStorageByName('roleName'))
    if (!this.roleName.includes('超级管理员'||'privateAdmin')) {
      this.currentRole = 'editorDashboard'
    }
  }
  }
</script>
