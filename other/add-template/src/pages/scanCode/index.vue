<template>
    <div>
        <button @click="start">扫码</button>
        <p>扫描结果：{{str}}</p>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                str: '',
            }
        },
        onShow() {},
        methods: {
            start() {
                // 只允许从相机扫码
                wx.scanCode({
                    onlyFromCamera: true,
                    success: res => {
                        console.log(res)
                        this.str = res.result;
                    },
                    fail: err => {
                        console.log(err)
                    }
                })
            }
        },
        components: {}
    }
</script>

<style>

</style>
