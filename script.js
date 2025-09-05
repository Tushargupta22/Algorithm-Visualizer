let array = [];
let isRunning = false;
let comparisons = 0;
let swaps = 0;
let startTime = 0;
let performanceChart = null;
let searchChart = null;
let comparisonChart = null;

// Algorithm information
const algorithmInfo = {
    bubble: {
        name: "Bubble Sort",
        description: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        stable: true,
        inPlace: true
    },
    selection: {
        name: "Selection Sort", 
        description: "Finds the minimum element and places it at the beginning, then repeats for the remaining elements.",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        stable: false,
        inPlace: true
    },
    insertion: {
        name: "Insertion Sort",
        description: "Builds the final sorted array one item at a time by inserting each element into its correct position.",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        stable: true,
        inPlace: true
    },
    merge: {
        name: "Merge Sort",
        description: "Divides the array into halves, sorts them separately, then merges the sorted halves.",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(n)",
        stable: true,
        inPlace: false
    },
    quick: {
        name: "Quick Sort",
        description: "Picks a pivot element and partitions the array around it, then recursively sorts the partitions.",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(log n)",
        stable: false,
        inPlace: true
    },
    heap: {
        name: "Heap Sort",
        description: "Builds a max heap from the array, then repeatedly extracts the maximum element.",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(1)",
        stable: false,
        inPlace: true
    },
    radix: {
        name: "Radix Sort",
        description: "Sorts numbers by processing individual digits from least to most significant digit.",
        timeComplexity: "O(nk)",
        spaceComplexity: "O(n + k)",
        stable: true,
        inPlace: false
    },
    bucket: {
        name: "Bucket Sort",
        description: "Distributes elements into buckets, sorts each bucket, then concatenates the results.",
        timeComplexity: "O(n + k)",
        spaceComplexity: "O(n + k)",
        stable: true,
        inPlace: false
    }
};

// Performance data storage
let performanceData = {
    sorting: {},
    searching: {}
};

// Initialize form elements
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners for the new control panel
    document.getElementById('size').addEventListener('input', function() {
        document.getElementById('sizeVal').textContent = this.value;
        generateArray();
    });
    
    document.getElementById('speed').addEventListener('input', function() {
        document.getElementById('speedVal').textContent = this.value;
    });
    
    document.getElementById('minVal').addEventListener('change', function() {
        generateArray();
    });
    
    document.getElementById('maxVal').addEventListener('change', function() {
        generateArray();
    });
    
    document.getElementById('algo').addEventListener('change', function() {
        const algo = this.value;
        const keyInput = document.getElementById('key');
        
        // Show/hide search key input based on algorithm type
        if (algo.includes('Search')) {
            keyInput.style.display = 'block';
        } else {
            keyInput.style.display = 'none';
        }
    });
    
    // Start button functionality
    document.querySelector('.panel button').addEventListener('click', function() {
        const algo = document.getElementById('algo').value;
        const searchKey = document.getElementById('key').value;
        
        if (algo.includes('Search')) {
            if (!searchKey) {
                alert('Please enter a search key');
                return;
            }
            document.getElementById('searchValue').value = searchKey;
            
            if (algo === 'Linear Search') startSearch('linear');
            else if (algo === 'Binary Search') startSearch('binary');
        } else if (algo === 'Compare All Algorithms') {
            runAllComparisons();
        } else {
            if (algo === 'Bubble Sort') startSort('bubble');
            else if (algo === 'Selection Sort') startSort('selection');
            else if (algo === 'Insertion Sort') startSort('insertion');
            else if (algo === 'Merge Sort') startSort('merge');
            else if (algo === 'Quick Sort') startSort('quick');
            else if (algo === 'Heap Sort') startSort('heap');
            else if (algo === 'Radix Sort') startSort('radix');
            else if (algo === 'Bucket Sort') startSort('bucket');
        }
    });
    
    // Generate initial array
    generateArray();
});

// Custom Array Function - ADDED THIS FUNCTION
function useCustomArray() {
    if (isRunning) return;
    
    const customArrayInput = document.getElementById('customArray').value;
    if (!customArrayInput.trim()) {
        alert('Please enter a custom array');
        return;
    }
    
    try {
        // Parse the custom array input
        const newArray = customArrayInput.split(',')
            .map(item => parseInt(item.trim()))
            .filter(item => !isNaN(item));
            
        if (newArray.length === 0) {
            alert('Please enter valid numbers separated by commas');
            return;
        }
        
        // Update the array and UI
        array = newArray;
        document.getElementById('size').value = array.length;
        document.getElementById('sizeVal').textContent = array.length;
        document.getElementById('sizeValue').textContent = array.length;
        
        renderBars();
        resetMetrics();
        
        // Show success message
        const customArrayGroup = document.querySelector('.control-group:has(#customArray)');
        customArrayGroup.style.borderLeft = '3px solid #4ecdc4';
        
        setTimeout(() => {
            customArrayGroup.style.borderLeft = '3px solid #4ecdc4';
        }, 2000);
        
    } catch (error) {
        alert('Error parsing custom array. Please use format: 5,3,8,1,9,2');
        console.error(error);
    }
}

function generateArray() {
    const size = document.getElementById('size').value || document.getElementById('arraySize').value;
    document.getElementById('sizeValue').textContent = size;
    array = [];
    
    const minVal = parseInt(document.getElementById('minVal').value) || 10;
    const maxVal = parseInt(document.getElementById('maxVal').value) || 100;
    
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal);
    }
    
    renderBars();
    resetMetrics();
}

function generateSortedArray() {
    generateArray();
    array.sort((a, b) => a - b);
    renderBars();
}

function generateReversedArray() {
    generateArray();
    array.sort((a, b) => b - a);
    renderBars();
}

function renderBars() {
    const container = document.getElementById('barsContainer');
    container.innerHTML = '';
    
    const maxValue = Math.max(...array);
    const containerWidth = container.clientWidth - 20;
    const barWidth = Math.max(8, containerWidth / array.length - 2);
    
    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${(value / maxValue) * 350}px`;
        bar.style.width = `${barWidth}px`;
        bar.id = `bar-${index}`;
        
        // Always show the number on the bar
        bar.textContent = value;
        
        // Add a class for small values to adjust text positioning if needed
        if (value < 20) {
            bar.classList.add('small-value');
        }
        
        container.appendChild(bar);
    });
}


function resetMetrics() {
    comparisons = 0;
    swaps = 0;
    startTime = Date.now();
    updateMetrics();
}

function updateMetrics() {
    document.getElementById('comparisons').textContent = comparisons;
    document.getElementById('swaps').textContent = swaps;
    document.getElementById('time').textContent = `${Date.now() - startTime}ms`;
}

async function startSort(algorithm) {
    if (isRunning) return;
    
    isRunning = true;
    resetMetrics();
    document.getElementById('currentAlgorithm').textContent = algorithmInfo[algorithm].name;
    
    // Update algorithm info
    const info = algorithmInfo[algorithm];
    document.getElementById('algorithmInfo').innerHTML = `
        <h4>${info.name}</h4>
        <p>${info.description}</p>
        <div style="margin-top: 10px;">
            <strong>Time Complexity:</strong> ${info.timeComplexity}<br>
            <strong>Space Complexity:</strong> ${info.spaceComplexity}<br>
            <strong>Stable:</strong> ${info.stable ? 'Yes' : 'No'}<br>
            <strong>In-Place:</strong> ${info.inPlace ? 'Yes' : 'No'}
        </div>
    `;
    
    const speed = 101 - (document.getElementById('speed').value || 50);
    
    switch (algorithm) {
        case 'bubble': await bubbleSort(speed); break;
        case 'selection': await selectionSort(speed); break;
        case 'insertion': await insertionSort(speed); break;
        case 'merge': await mergeSort(0, array.length - 1, speed); break;
        case 'quick': await quickSort(0, array.length - 1, speed); break;
        case 'heap': await heapSort(speed); break;
        case 'radix': await radixSort(speed); break;
        case 'bucket': await bucketSort(speed); break;
    }
    
    // Mark all bars as sorted
    for (let i = 0; i < array.length; i++) {
        document.getElementById(`bar-${i}`).classList.add('sorted');
    }
    
    // Store performance data
    performanceData.sorting[algorithm] = {
        comparisons: comparisons,
        swaps: swaps,
        time: Date.now() - startTime
    };
    
    updatePerformanceChart(algorithm);
    isRunning = false;
}


// ... (previous code remains the same)

async function bubbleSort(speed) {
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            comparisons++;
            
            // Highlight comparing bars
            document.getElementById(`bar-${j}`).classList.add('comparing');
            document.getElementById(`bar-${j + 1}`).classList.add('comparing');
            
            if (array[j] > array[j + 1]) {
                swaps++;
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                
                // Update bar heights
                const bar1 = document.getElementById(`bar-${j}`);
                const bar2 = document.getElementById(`bar-${j + 1}`);
                const maxValue = Math.max(...array);
                
                bar1.style.height = `${(array[j] / maxValue) * 350}px`;
                bar2.style.height = `${(array[j + 1] / maxValue) * 350}px`;
                // Always show the number
                bar1.textContent = array[j];
                bar2.textContent = array[j + 1];
            }
            
            updateMetrics();
            await sleep(speed);
            
            // Remove highlighting
            document.getElementById(`bar-${j}`).classList.remove('comparing');
            document.getElementById(`bar-${j + 1}`).classList.remove('comparing');
        }
    }
}

async function selectionSort(speed) {
    for (let i = 0; i < array.length; i++) {
        let minIdx = i;
        
        for (let j = i + 1; j < array.length; j++) {
            comparisons++;
            
            document.getElementById(`bar-${j}`).classList.add('comparing');
            document.getElementById(`bar-${minIdx}`).classList.add('comparing');
            
            if (array[j] < array[minIdx]) {
                document.getElementById(`bar-${minIdx}`).classList.remove('comparing');
                minIdx = j;
            }
            
            updateMetrics();
            await sleep(speed);
            
            document.getElementById(`bar-${j}`).classList.remove('comparing');
            if (j !== minIdx) document.getElementById(`bar-${minIdx}`).classList.remove('comparing');
        }
        
        if (minIdx !== i) {
            swaps++;
            [array[i], array[minIdx]] = [array[minIdx], array[i]];
            
            const bar1 = document.getElementById(`bar-${i}`);
            const bar2 = document.getElementById(`bar-${minIdx}`);
            const maxValue = Math.max(...array);
            
            bar1.style.height = `${(array[i] / maxValue) * 350}px`;
            bar2.style.height = `${(array[minIdx] / maxValue) * 350}px`;
            // Always show the number
            bar1.textContent = array[i];
            bar2.textContent = array[minIdx];
        }
        
        document.getElementById(`bar-${i}`).classList.add('sorted');
    }
}

async function insertionSort(speed) {
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        
        document.getElementById(`bar-${i}`).classList.add('comparing');
        
        while (j >= 0 && array[j] > key) {
            comparisons++;
            swaps++;
            
            array[j + 1] = array[j];
            
            const bar = document.getElementById(`bar-${j + 1}`);
            const maxValue = Math.max(...array);
            bar.style.height = `${(array[j + 1] / maxValue) * 350}px`;
            // Always show the number
            bar.textContent = array[j + 1];
            
            j--;
            updateMetrics();
            await sleep(speed);
        }
        
        array[j + 1] = key;
        const bar = document.getElementById(`bar-${j + 1}`);
        const maxValue = Math.max(...array);
        bar.style.height = `${(key / maxValue) * 350}px`;
        // Always show the number
        bar.textContent = key;
        
        document.getElementById(`bar-${i}`).classList.remove('comparing');
    }
}

async function mergeSort(left, right, speed) {
    if (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        await mergeSort(left, mid, speed);
        await mergeSort(mid + 1, right, speed);
        await merge(left, mid, right, speed);
    }
}

async function merge(left, mid, right, speed) {
    const leftArr = array.slice(left, mid + 1);
    const rightArr = array.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;
    
    while (i < leftArr.length && j < rightArr.length) {
        comparisons++;
        
        if (leftArr[i] <= rightArr[j]) {
            array[k] = leftArr[i];
            i++;
        } else {
            array[k] = rightArr[j];
            j++;
        }
        
        swaps++;
        const bar = document.getElementById(`bar-${k}`);
        const maxValue = Math.max(...array);
        bar.style.height = `${(array[k] / maxValue) * 350}px`;
        // Always show the number
        bar.textContent = array[k];
        bar.classList.add('comparing');
        
        updateMetrics();
        await sleep(speed);
        bar.classList.remove('comparing');
        k++;
    }
    
    while (i < leftArr.length) {
        array[k] = leftArr[i];
        swaps++;
        
        const bar = document.getElementById(`bar-${k}`);
        const maxValue = Math.max(...array);
        bar.style.height = `${(array[k] / maxValue) * 350}px`;
        // Always show the number
        bar.textContent = array[k];
        
        i++;
        k++;
        updateMetrics();
        await sleep(speed);
    }
    
    while (j < rightArr.length) {
        array[k] = rightArr[j];
        swaps++;
        
        const bar = document.getElementById(`bar-${k}`);
        const maxValue = Math.max(...array);
        bar.style.height = `${(array[k] / maxValue) * 350}px`;
        // Always show the number
        bar.textContent = array[k];
        
        j++;
        k++;
        updateMetrics();
        await sleep(speed);
    }
}

async function quickSort(low, high, speed) {
    if (low < high) {
        const pi = await partition(low, high, speed);
        await quickSort(low, pi - 1, speed);
        await quickSort(pi + 1, high, speed);
    }
}

async function partition(low, high, speed) {
    const pivot = array[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        comparisons++;
        
        document.getElementById(`bar-${j}`).classList.add('comparing');
        document.getElementById(`bar-${high}`).classList.add('comparing');
        
        if (array[j] < pivot) {
            i++;
            if (i !== j) {
                swaps++;
                [array[i], array[j]] = [array[j], array[i]];
                
                const bar1 = document.getElementById(`bar-${i}`);
                const bar2 = document.getElementById(`bar-${j}`);
                const maxValue = Math.max(...array);
                
                bar1.style.height = `${(array[i] / maxValue) * 350}px`;
                bar2.style.height = `${(array[j] / maxValue) * 350}px`;
                // Always show the number
                bar1.textContent = array[i];
                bar2.textContent = array[j];
            }
        }
        
        updateMetrics();
        await sleep(speed);
        
        document.getElementById(`bar-${j}`).classList.remove('comparing');
        document.getElementById(`bar-${high}`).classList.remove('comparing');
    }
    
    swaps++;
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    
    const bar1 = document.getElementById(`bar-${i + 1}`);
    const bar2 = document.getElementById(`bar-${high}`);
    const maxValue = Math.max(...array);
    
    bar1.style.height = `${(array[i + 1] / maxValue) * 350}px`;
    bar2.style.height = `${(array[high] / maxValue) * 350}px`;
    // Always show the number
    bar1.textContent = array[i + 1];
    bar2.textContent = array[high];
    
    return i + 1;
}

async function heapSort(speed) {
    // Build max heap
    for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
        await heapify(array.length, i, speed);
    }
    
    // Extract elements from heap one by one
    for (let i = array.length - 1; i > 0; i--) {
        swaps++;
        [array[0], array[i]] = [array[i], array[0]];
        
        const bar1 = document.getElementById(`bar-0`);
        const bar2 = document.getElementById(`bar-${i}`);
        const maxValue = Math.max(...array);
        
        bar1.style.height = `${(array[0] / maxValue) * 350}px`;
        bar2.style.height = `${(array[i] / maxValue) * 350}px`;
        // Always show the number
        bar1.textContent = array[0];
        bar2.textContent = array[i];
        
        document.getElementById(`bar-${i}`).classList.add('sorted');
        
        await heapify(i, 0, speed);
        updateMetrics();
        await sleep(speed);
    }
}

async function heapify(n, i, speed) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;
    
    if (left < n) {
        comparisons++;
        if (array[left] > array[largest]) {
            largest = left;
        }
    }
    
    if (right < n) {
        comparisons++;
        if (array[right] > array[largest]) {
            largest = right;
        }
    }
    
    if (largest !== i) {
        swaps++;
        [array[i], array[largest]] = [array[largest], array[i]];
        
        const bar1 = document.getElementById(`bar-${i}`);
        const bar2 = document.getElementById(`bar-${largest}`);
        const maxValue = Math.max(...array);
        
        bar1.style.height = `${(array[i] / maxValue) * 350}px`;
        bar2.style.height = `${(array[largest] / maxValue) * 350}px`;
        // Always show the number
        bar1.textContent = array[i];
        bar2.textContent = array[largest];
        
        bar1.classList.add('comparing');
        bar2.classList.add('comparing');
        
        updateMetrics();
        await sleep(speed);
        
        bar1.classList.remove('comparing');
        bar2.classList.remove('comparing');
        
        await heapify(n, largest, speed);
    }
}

async function radixSort(speed) {
    const max = Math.max(...array);
    
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        await countingSort(exp, speed);
    }
}

async function countingSort(exp, speed) {
    const output = new Array(array.length);
    const count = new Array(10).fill(0);
    
    // Count occurrences
    for (let i = 0; i < array.length; i++) {
        count[Math.floor(array[i] / exp) % 10]++;
        comparisons++;
    }
    
    // Change count[i] to actual position
    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }
    
    // Build output array
    for (let i = array.length - 1; i >= 0; i--) {
        output[count[Math.floor(array[i] / exp) % 10] - 1] = array[i];
        count[Math.floor(array[i] / exp) % 10]--;
        swaps++;
    }
    
    // Copy output array to array
    for (let i = 0; i < array.length; i++) {
        array[i] = output[i];
        
        const bar = document.getElementById(`bar-${i}`);
        const maxValue = Math.max(...array);
        bar.style.height = `${(array[i] / maxValue) * 350}px`;
        // Always show the number
        bar.textContent = array[i];
        bar.classList.add('comparing');
        
        updateMetrics();
        await sleep(speed);
        bar.classList.remove('comparing');
    }
}

async function bucketSort(speed) {
    const bucketCount = 10;
    const buckets = Array.from({ length: bucketCount }, () => []);
    const max = Math.max(...array);
    const min = Math.min(...array);
    const range = max - min;
    
    // Distribute elements into buckets
    for (let i = 0; i < array.length; i++) {
        const bucketIndex = Math.floor(((array[i] - min) / range) * (bucketCount - 1));
        buckets[bucketIndex].push(array[i]);
        comparisons++;
    }
    
    // Sort individual buckets and concatenate
    let index = 0;
    for (let i = 0; i < bucketCount; i++) {
        buckets[i].sort((a, b) => a - b);
        
        for (let j = 0; j < buckets[i].length; j++) {
            array[index] = buckets[i][j];
            swaps++;
            
            const bar = document.getElementById(`bar-${index}`);
            const maxValue = Math.max(...array);
            bar.style.height = `${(array[index] / maxValue) * 350}px`;
            // Always show the number
            bar.textContent = array[index];
            bar.classList.add('comparing');
            
            updateMetrics();
            await sleep(speed);
            bar.classList.remove('comparing');
            
            index++;
        }
    }
}

// ... (rest of the code remains the same)


// Searching Algorithms
async function startSearch(algorithm) {
    if (isRunning) return;
    
    const searchValue = parseInt(document.getElementById('searchValue').value);
    if (isNaN(searchValue)) {
        alert('Please enter a valid search value');
        return;
    }
    
    isRunning = true;
    resetMetrics();
    
    let result = -1;
    let searchSteps = [];
    
    switch (algorithm) {
        case 'linear':
            result = await linearSearch(searchValue, searchSteps);
            break;
        case 'binary':
            // Sort array first for binary search
            array.sort((a, b) => a - b);
            renderBars();
            await sleep(500);
            result = await binarySearch(searchValue, 0, array.length - 1, searchSteps);
            break;
    }
    
    // Store performance data
    performanceData.searching[algorithm] = {
        comparisons: comparisons,
        steps: searchSteps.length,
        time: Date.now() - startTime,
        found: result !== -1
    };
    
    displaySearchResult(algorithm, searchValue, result, searchSteps);
    updateSearchChart(algorithm, searchSteps.length);
    isRunning = false;
}

async function linearSearch(target, steps) {
    for (let i = 0; i < array.length; i++) {
        comparisons++;
        steps.push(i);
        
        document.getElementById(`bar-${i}`).classList.add('comparing');
        updateMetrics();
        await sleep(100);
        
        if (array[i] === target) {
            document.getElementById(`bar-${i}`).classList.add('sorted');
            return i;
        }
        
        document.getElementById(`bar-${i}`).classList.remove('comparing');
    }
    return -1;
}

async function binarySearch(target, left, right, steps) {
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        comparisons++;
        steps.push(mid);
        
        document.getElementById(`bar-${mid}`).classList.add('comparing');
        updateMetrics();
        await sleep(200);
        
        if (array[mid] === target) {
            document.getElementById(`bar-${mid}`).classList.add('sorted');
            return mid;
        } else if (array[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
        
        document.getElementById(`bar-${mid}`).classList.remove('comparing');
    }
    return -1;
}

function displaySearchResult(algorithm, target, result, steps) {
    const resultsDiv = document.getElementById('searchResults');
    const algorithmName = algorithm.charAt(0).toUpperCase() + algorithm.slice(1) + ' Search';
    
    if (result !== -1) {
        resultsDiv.innerHTML = `
            <div style="background: rgba(76, 175, 80, 0.2); padding: 15px; border-radius: 10px; margin: 10px 0;">
                <h4>✅ ${algorithmName} - Success!</h4>
                <p>Found value ${target} at index ${result}</p>
                <p>Steps taken: ${steps.length}</p>
                <p>Comparisons: ${comparisons}</p>
            </div>
        `;
    } else {
        resultsDiv.innerHTML = `
            <div style="background: rgba(244, 67, 54, 0.2); padding: 15px; border-radius: 10px; margin: 10px 0;">
                <h4>❌ ${algorithmName} - Not Found</h4>
                <p>Value ${target} not found in array</p>
                <p>Steps taken: ${steps.length}</p>
                <p>Comparisons: ${comparisons}</p>
            </div>
        `;
    }
}

function updatePerformanceChart(algorithm) {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    if (performanceChart) {
        performanceChart.destroy();
    }
    
    performanceChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Comparisons', 'Swaps', 'Array Size'],
            datasets: [{
                data: [comparisons, swaps, array.length],
                backgroundColor: [
                    'rgba(255, 107, 107, 0.8)',
                    'rgba(78, 205, 196, 0.8)',
                    'rgba(255, 193, 7, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 107, 107, 1)',
                    'rgba(78, 205, 196, 1)',
                    'rgba(255, 193, 7, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `${algorithmInfo[algorithm].name} Performance`,
                    color: 'white'
                },
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            }
        }
    });
}

function updateSearchChart(algorithm, steps) {
    const ctx = document.getElementById('searchChart').getContext('2d');
    
    if (searchChart) {
        searchChart.destroy();
    }
    
    searchChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Steps', 'Comparisons', 'Array Size'],
            datasets: [{
                label: `${algorithm.charAt(0).toUpperCase() + algorithm.slice(1)} Search`,
                data: [steps, comparisons, array.length],
                backgroundColor: [
                    'rgba(255, 107, 107, 0.8)',
                    'rgba(78, 205, 196, 0.8)',
                    'rgba(255, 193, 7, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 107, 107, 1)',
                    'rgba(78, 205, 196, 1)',
                    'rgba(255, 193, 7, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

// Comparison functions
async function compareSortingAlgorithms() {
    if (isRunning) return;
    
    isRunning = true;
    const originalArray = [...array];
    const speed = 101 - (document.getElementById('speed').value || 50);
    
    const sortingAlgorithms = ['bubble', 'selection', 'insertion', 'merge', 'quick', 'heap', 'radix', 'bucket'];
    
    for (const algorithm of sortingAlgorithms) {
        // Reset array to original state
        array = [...originalArray];
        renderBars();
        resetMetrics();
        
        document.getElementById('currentAlgorithm').textContent = `Comparing: ${algorithmInfo[algorithm].name}`;
        
        // Run the algorithm
        switch (algorithm) {
            case 'bubble': await bubbleSort(speed); break;
            case 'selection': await selectionSort(speed); break;
            case 'insertion': await insertionSort(speed); break;
            case 'merge': await mergeSort(0, array.length - 1, speed); break;
            case 'quick': await quickSort(0, array.length - 1, speed); break;
            case 'heap': await heapSort(speed); break;
            case 'radix': await radixSort(speed); break;
            case 'bucket': await bucketSort(speed); break;
        }
        
        // Store performance data
        performanceData.sorting[algorithm] = {
            comparisons: comparisons,
            swaps: swaps,
            time: Date.now() - startTime
        };
        
        await sleep(500);
    }
    
    // Restore original array
    array = [...originalArray];
    renderBars();
    isRunning = false;
    
    // Show comparison results
    showComparisonResults();
}

async function compareSearchingAlgorithms() {
    if (isRunning) return;
    
    const searchValue = parseInt(document.getElementById('searchValue').value);
    if (isNaN(searchValue)) {
        alert('Please enter a valid search value');
        return;
    }
    
    isRunning = true;
    const originalArray = [...array];
    
    const searchingAlgorithms = ['linear', 'binary'];
    
    for (const algorithm of searchingAlgorithms) {
        // Reset array to original state for linear search
        if (algorithm === 'linear') {
            array = [...originalArray];
            renderBars();
            resetMetrics();
        } 
        // For binary search, we need a sorted array
        else {
            array = [...originalArray];
            array.sort((a, b) => a - b);
            renderBars();
            await sleep(500);
        }
        
        document.getElementById('currentAlgorithm').textContent = `Comparing: ${algorithm}`;
        
        let result = -1;
        let searchSteps = [];
        
        // Run the algorithm
        switch (algorithm) {
            case 'linear': 
                result = await linearSearch(searchValue, searchSteps);
                break;
            case 'binary': 
                result = await binarySearch(searchValue, 0, array.length - 1, searchSteps);
                break;
        }
        
        // Store performance data
        performanceData.searching[algorithm] = {
            comparisons: comparisons,
            steps: searchSteps.length,
            time: Date.now() - startTime,
            found: result !== -1
        };
        
        await sleep(500);
    }
    
    // Restore original array
    array = [...originalArray];
    renderBars();
    isRunning = false;
    
    // Show comparison results
    showComparisonResults();
}

// ... (previous code remains the same)

function showComparisonResults() {
    const resultsDiv = document.getElementById('comparisonResults');
    let html = '<div class="comparison-results">';
    
    // Sorting comparison
    if (Object.keys(performanceData.sorting).length > 0) {
        html += `
            <div class="comparison-card">
                <h4>🔄 Sorting Algorithms Performance</h4>
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Algorithm</th>
                            <th>Time (ms)</th>
                            <th>Comparisons</th>
                            <th>Swaps</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        // Find best and worst performers for sorting
        let fastestSort = null;
        let slowestSort = null;
        let leastComparisons = null;
        let mostComparisons = null;
        let leastSwaps = null;
        let mostSwaps = null;
        
        for (const algorithm in performanceData.sorting) {
            const data = performanceData.sorting[algorithm];
            
            if (!fastestSort || data.time < performanceData.sorting[fastestSort].time) {
                fastestSort = algorithm;
            }
            
            if (!slowestSort || data.time > performanceData.sorting[slowestSort].time) {
                slowestSort = algorithm;
            }
            
            if (!leastComparisons || data.comparisons < performanceData.sorting[leastComparisons].comparisons) {
                leastComparisons = algorithm;
            }
            
            if (!mostComparisons || data.comparisons > performanceData.sorting[mostComparisons].comparisons) {
                mostComparisons = algorithm;
            }
            
            if (!leastSwaps || data.swaps < performanceData.sorting[leastSwaps].swaps) {
                leastSwaps = algorithm;
            }
            
            if (!mostSwaps || data.swaps > performanceData.sorting[mostSwaps].swaps) {
                mostSwaps = algorithm;
            }
        }
        
        // Add rows for sorting algorithms
        for (const algorithm in performanceData.sorting) {
            const data = performanceData.sorting[algorithm];
            const isFastest = algorithm === fastestSort;
            const isSlowest = algorithm === slowestSort;
            
            html += `
                <tr class="${isFastest ? 'best-performance' : ''} ${isSlowest ? 'worst-performance' : ''}">
                    <td>${algorithmInfo[algorithm].name}</td>
                    <td>${data.time}</td>
                    <td>${data.comparisons}</td>
                    <td>${data.swaps}</td>
                </tr>
            `;
        }
        
        html += `
                    </tbody>
                </table>
                <div style="margin-top: 10px;">
                    <p>🏆 Fastest: ${algorithmInfo[fastestSort].name}</p>
                    <p>🐌 Slowest: ${algorithmInfo[slowestSort].name}</p>
                    <p>📊 Most Efficient: ${algorithmInfo[leastComparisons].name}</p>
                </div>
            </div>
        `;
    }
    
    // Searching comparison
    if (Object.keys(performanceData.searching).length > 0) {
        html += `
            <div class="comparison-card">
                <h4>🔍 Searching Algorithms Performance</h4>
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Algorithm</th>
                            <th>Time (ms)</th>
                            <th>Comparisons</th>
                            <th>Steps</th>
                            <th>Found</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        // Find best and worst performers for searching
        let fastestSearch = null;
        let slowestSearch = null;
        let leastComparisonsSearch = null;
        let mostComparisonsSearch = null;
        let leastSteps = null;
        let mostSteps = null;
        
        for (const algorithm in performanceData.searching) {
            const data = performanceData.searching[algorithm];
            
            if (!fastestSearch || data.time < performanceData.searching[fastestSearch].time) {
                fastestSearch = algorithm;
            }
            
            if (!slowestSearch || data.time > performanceData.searching[slowestSearch].time) {
                slowestSearch = algorithm;
            }
            
            if (!leastComparisonsSearch || data.comparisons < performanceData.searching[leastComparisonsSearch].comparisons) {
                leastComparisonsSearch = algorithm;
            }
            
            if (!mostComparisonsSearch || data.comparisons > performanceData.searching[mostComparisonsSearch].comparisons) {
                mostComparisonsSearch = algorithm;
            }
            
            if (!leastSteps || data.steps < performanceData.searching[leastSteps].steps) {
                leastSteps = algorithm;
            }
            
            if (!mostSteps || data.steps > performanceData.searching[mostSteps].steps) {
                mostSteps = algorithm;
            }
        }
        
        // Add rows for searching algorithms
        for (const algorithm in performanceData.searching) {
            const data = performanceData.searching[algorithm];
            const isFastest = algorithm === fastestSearch;
            const isSlowest = algorithm === slowestSearch;
            
            html += `
                <tr class="${isFastest ? 'best-performance' : ''} ${isSlowest ? 'worst-performance' : ''}">
                    <td>${algorithm.charAt(0).toUpperCase() + algorithm.slice(1)} Search</td>
                    <td>${data.time}</td>
                    <td>${data.comparisons}</td>
                    <td>${data.steps}</td>
                    <td>${data.found ? '✅' : '❌'}</td>
                </tr>
            `;
        }
        
        html += `
                    </tbody>
                </table>
                <div style="margin-top: 10px;">
                    <p>🏆 Fastest: ${fastestSearch.charAt(0).toUpperCase() + fastestSearch.slice(1)} Search</p>
                    <p>🐌 Slowest: ${slowestSearch.charAt(0).toUpperCase() + slowestSearch.slice(1)} Search</p>
                    <p>📊 Most Efficient: ${leastSteps.charAt(0).toUpperCase() + leastSteps.slice(1)} Search</p>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    resultsDiv.innerHTML = html;
    
    // Update comparison chart
    updateComparisonChart();
}

// ... (rest of the code remains the same)


// new start


function updateComparisonChart() {
    const ctx = document.getElementById('comparisonChart').getContext('2d');
    
    if (comparisonChart) {
        comparisonChart.destroy();
    }
    
    // Prepare data for chart
    const sortingLabels = [];
    const sortingTimes = [];
    const sortingComparisons = [];
    
    for (const algorithm in performanceData.sorting) {
        sortingLabels.push(algorithmInfo[algorithm].name);
        sortingTimes.push(performanceData.sorting[algorithm].time);
        sortingComparisons.push(performanceData.sorting[algorithm].comparisons);
    }
    
    const searchingLabels = [];
    const searchingTimes = [];
    const searchingComparisons = [];
    
    for (const algorithm in performanceData.searching) {
        searchingLabels.push(algorithm.charAt(0).toUpperCase() + algorithm.slice(1) + ' Search');
        searchingTimes.push(performanceData.searching[algorithm].time);
        searchingComparisons.push(performanceData.searching[algorithm].comparisons);
    }
    
    // Create chart with two datasets
    comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortingLabels.length > 0 ? sortingLabels : searchingLabels,
            datasets: [
                {
                    label: 'Time (ms)',
                    data: sortingTimes.length > 0 ? sortingTimes : searchingTimes,
                    backgroundColor: 'rgba(255, 107, 107, 0.8)',
                    borderColor: 'rgba(255, 107, 107, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Comparisons',
                    data: sortingComparisons.length > 0 ? sortingComparisons : searchingComparisons,
                    backgroundColor: 'rgba(78, 205, 196, 0.8)',
                    borderColor: 'rgba(78, 205, 196, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: sortingLabels.length > 0 ? 'Sorting Algorithms Comparison' : 'Searching Algorithms Comparison',
                    color: 'white'
                },
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

function runAllComparisons() {
    compareSortingAlgorithms();
    compareSearchingAlgorithms();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize
generateArray();


