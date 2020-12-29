<template>
  <div class="modal">
    <div class="mask" @click="maskClick"></div>
    <div class="modal-content">
      <div class="title">{{ title }}</div>
      <div class="content">
        <slot />
      </div>
      <div v-if="actions" class="actions">
        <el-button @click="$emit('cancel')">Отмена</el-button>
        <el-button type="success" @click="$emit('submit')">Сохранить</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Modal',
    props: {
      persistent: {
        type: Boolean,
        default() {
          return true;
        }
      },
      title: {
        type: String,
        default() {
          return '';
        }
      },
      actions: {
        type: Boolean,
        default () {
          return true;
        }
      }
    },
    methods: {
      maskClick() {
        if (!this.persistent) {
          this.$emit('cancel');
        }
      },
    }
  }
</script>

<style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 98;
  }

  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    background: gray;
    opacity: 0.4;
    z-index: 99;
  }

  .modal-content {
    position: absolute;
    width: 700px;
    left: calc(50% - 250px);
    top: 50%;
    transform: translateY(-50%);
    background: white;
    border-radius: 8px;
    z-index: 100;
    max-height: 100%;
    overflow: auto;
  }

  .content {
    padding: 0 20px;
  }

  .actions {
    padding: 20px;
    text-align: right;
  }

  .title {
    text-align: center;
    padding: 20px;
    font-size: 18px;
    background-color: #5f617b;
    color: #c3c3c3;
    margin-bottom: 20px;
    border-radius: 8px 8px 0 0;
  }

</style>
