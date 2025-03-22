<template>
    <div class="fixed pr-5 pt-5 w-full flex justify-end" @click="emit('close-event', true)">
        <FeatherIcon name="x" class=" text-white size-8" />
    </div>
    <div v-show="showPreview" class="flex justify-center items-center h-screen bg-black">
        <img id="preview-image"/>
    </div>
    <div v-if="!showPreview">
        <video ref="video" autoplay muted hidden playsinline webkit-playsinline></video>
        <div class="flex justify-center items-center h-screen bg-black">
            <canvas ref="canvas" :width="width"></canvas>
        </div>
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
import { FeatherIcon } from "frappe-ui";
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

const width = ref(window.innerWidth);

const constraints = ref({
    video : {
        facingMode : "environment",
        width: { ideal: 4096 },
        height: { ideal: 2160 } 
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
        stopCamera()
    }
})

function Draw() {
    ctx.value.drawImage(video.value, 0, 0,canvas.value.width,video.value.videoHeight / (video.value.videoWidth / canvas.value.width))
    requestAnimationFrame(Draw)
}

function stopCamera(){
    const mediaStream = video.value.srcObject
    const tracks = mediaStream.getTracks();
    tracks.forEach(track => track.stop())
}

function captureImage(){
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