<script setup>
// For chart on homepage covering D3, SVG, and DOM

import { ref, onMounted, watch } from 'vue'
import * as d3 from 'd3'

const props = defineProps({
    data: {
        type: Array,
        default: () => []
    }
})

const chartContainer = ref(null)

function renderChart() {
    const container = d3.select(chartContainer.value)
    container.html('')

    if (!props.data.length) return

    const data = [...props.data].sort((a, b) => b.value - a.value)

    const maxValue = d3.max(data, (d) => d.value) || 0

    const width = 760
    const height = 420
    const margin = { top: 30, right: 30, bottom: 90, left: 70 }

    // chart
    const svg = container
        .append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('width', '100%')
        .attr('height', height)

    // x-scale
    const x = d3
        .scaleBand()
        .domain(data.map((d) => d.label))
        .range([margin.left, width - margin.right])
        .padding(0.2)

    // y-scale
    const y = d3
        .scaleLinear()
        .domain([0, maxValue])
        .range([height - margin.bottom, margin.top])

    // bars
    svg
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d) => x(d.label))
        .attr('y', (d) => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', (d) => height - margin.bottom - y(d.value))
        .attr('rx', 4)
        .attr('ry', 4)

    // numbers above bars
    svg
        .selectAll('.bar-label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'bar-label')
        .attr('x', (d) => x(d.label) + x.bandwidth() / 2)
        .attr('y', (d) => y(d.value) - 8)
        .attr('text-anchor', 'middle')
        .text((d) => d.value)

    // x-axis
    svg
        .append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style('text-anchor', 'middle')

    // y-axis
    svg
        .append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(
            d3
            .axisLeft(y)
            .tickValues(d3.range(0, maxValue + 1, 1))
            .tickFormat(d3.format('d'))
        )

    // x title
    svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', height - 20)
        .attr('text-anchor', 'middle')
        .text('Country')

    // y title
    svg
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .text('Number of Landmarks')
}

onMounted(renderChart)

watch(
    () => props.data,
    () => {
        renderChart()
    },
    { deep: true }
)
</script>

<template>
    <div ref="chartContainer" class="chart-container"></div>
</template>

<style scoped>
.chart-container {
    width: 100%;
    min-height: 420px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 12px;
    padding: 1rem;
}
</style>