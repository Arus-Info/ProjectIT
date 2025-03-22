<template>
    <div class="flex items-center flex-col">
        <img id="preview-image" class="w-screen h-screen" v-show="showPreview"/>
    </div>
    <div v-if="!showPreview">
        <!-- <div class="flex justify-center"> -->
            <video ref="video" autoplay muted hidden playsinline webkit-playsinline></video>
            <!-- <canvas ref="canvas" class="w-screen h-screen"></canvas> -->
            <canvas ref="canvas" :height="height"  :width="width"></canvas>
        <!-- </div> -->
        <div class="fixed bottom-12 w-full flex items-center justify-between pl-10 pr-10">
            <div>
                <button @click="swapCamera">
                    <div>
                        <SwapIcon class=" h-7 w-7"></SwapIcon>
                    </div>
                </button>
            </div>
            <div>
                <button @click="captureImage">
                    <CameraIcon class=" h-10 w-10"></CameraIcon>
                </button>
            </div>
            <div></div>
        </div>
    </div>
    <div v-else class="flex items-center flex-col pt-7 fixed bottom-12 w-full">
        <PrimaryButton  @click="endCamera" :name="props.mode"> </PrimaryButton>
    </div>
</template>
<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import SwapIcon from '../pages/icons/SwapIcon.vue';
import CameraIcon from '../pages/icons/CameraIcon.vue';
import PrimaryButton from './PrimaryButton.vue';

const props = defineProps({
    mode : String
})

const emit = defineEmits(['close-event','capture-event'])
const video = ref(null)
const canvas = ref(null)
const ctx = ref(null)

const height = ref(window.innerHeight);
const width = ref(window.innerWidth);

const constraints = ref({
    video : {
        facingMode : "environment"
    },
    audio : false
})

const showPreview = ref(false)
const imageFile = ref(null)

onMounted(async () => {
    if (video.value && canvas.value) {
        ctx.value = canvas.value.getContext("2d")
        getCamera()
    }
})

onBeforeUnmount(() => {
    if(video.value)
    {
        // videoPlayer.videoHeight / (videoPlayer.videoWidth / canvas.width)
        console.log(video.value)
        stopCamera()
    }
})

function Draw() {
    ctx.value.drawImage(video.value, 0, 0,width.value,video.value.videoHeight / (video.value.videoWidth / width.value))
    requestAnimationFrame(Draw)
}

function stopCamera(){
    const mediaStream = video.value.srcObject
    const tracks = mediaStream.getTracks();
    tracks.forEach(track => track.stop())
}

function captureImage(){
    console.log(video.value.videoHeight,video.value.videoWidth)
    var dataurl = canvas.value.toDataURL("image/png")
    var image = document.getElementById('preview-image')
    image.src = dataurl
    stopCamera()
    showPreview.value = true
    imageFile.value = dataURLtoFile(dataurl,`${new Date().toISOString()}_${props.mode}.png`)
}

function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

function endCamera(){
    emit('capture-event',imageFile.value)
    emit('close-event', true)
}

function swapCamera() {
    stopCamera()
    if (constraints.value.video.facingMode == "user") {
        constraints.value.video.facingMode = "environment"
    }
    else {
        constraints.value.video.facingMode = "user"
    }
    getCamera()
}

function getCamera() {
    navigator.mediaDevices.getUserMedia(constraints.value)
        .then((stream) => {
            video.value.srcObject = stream
            video.value.play()
            requestAnimationFrame(Draw)
        })
}

</script>
<style scoped>
#my-canvas{
    height: 100vh; 
    width:  100vw; 
}
</style>