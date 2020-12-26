<template>
  <div class="bars-canvas-container">
    <transition name="fade">
      <div class="bars-loader-spin" v-if="loading">
        <svg
          width="200px"
          height="200px"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid"
          class="lds-dual-ring"
          style="background: none;"
        >
            <circle
              cx="50"
              cy="50"
              fill="none"
              stroke-linecap="round"
              r="40" stroke-width="4"
              stroke="#E834B1"
              stroke-dasharray="62.83185307179586 62.83185307179586"
              transform="rotate(257.961 50 50)"
            >
            <animateTransform
              attributeName="transform"
              type="rotate"
              calcMode="linear"
              values="0 50 50;360 50 50"
              keyTimes="0;1"
              dur="1s"
              begin="0s"
              repeatCount="indefinite">
            </animateTransform>
          </circle>
        </svg>
      </div>
    </transition>
    <canvas ref="canvas"></canvas>
  </div>
</template>
<script>
import { Line, mixins } from 'vue-chartjs'

export default {
  extends: Line,
  mixins: [mixins.reactiveProp],
  props: {
    options: Object,
    loading: Boolean
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
  },
  methods: {
    update () {
      this.renderChart(this.chartData, this.options)
    }
  }
}
</script>
<style lang="scss">
  .bars-canvas-container {
    transition: all .3s;
    position: relative;
  }
  .bars-loader-spin {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(255,255,255,.5);
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 4rem;
      height: 4rem;
    }
  }
</style>
