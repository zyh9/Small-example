<template>
    <div class="admin_user_info">
        <div class="options optionsTop">
            <p>头像</p>
            <img :src="info.MemberHeader?info.MemberHeader:'https://otherfiles-ali.uupt.com/Stunner/FE/M/46af93a96bf54d7c91d2e0ba52e4da1b_big.png'">
        </div>
        <div class="options">
            <p>昵称</p>
            <p>{{info.MemberName}}</p>
        </div>
        <div class="options">
            <p>电话</p>
            <p>{{info.MemberPhone}}</p>
        </div>
        <div class="options">
            <p>生日</p>
            <p>{{timer}}</p>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                info: {},
                timer: ''
            }
        },
        onShow() {
            this.info = wx.getStorageSync('memberItem');

            // this.info.MemberBirthday = this.util.FmtTime(new Date(this.info.MemberBirthday),'yyyy-MM-dd');

            this.timer = this.info.MemberBirthday.split(' ')[0];
        },
        methods: {

        },
        components: {

        }
    }
</script>

<style lang="less">
    page{
        height: 100%;
        background: #eeeef4;
    }
    .admin_user_info {
        // height: 100%;
        background: #fff;
        position: relative;
        .options {
            background: #fff;
            margin-left: 36rpx;
            // padding: 36rpx 36rpx 36rpx 0;
            padding-right: 36rpx;
            box-sizing: border-box;
            // min-height: 110rpx;
            height: 110rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            &:after {
                content: '';
                display: block;
                width: 100%;
                height: 0;
                border-bottom: 1px solid #ebebeb;
                position: absolute;
                bottom: 0;
                left: 0;
                transform: scaleY(0.5);
                transform-origin: 0 0;
            }
            p {
                color: #1a1a1a;
                font-size: 28rpx;
            }
            span {
                color: #999;
                font-size: 28rpx;
                margin-right: 20rpx;
            }
            img {
                width: 96rpx;
                height: 96rpx;
                border-radius: 50%;
            }
            .edit_tel {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                p {
                    margin-right: 20rpx;
                }
            }
        }
        .options:last-child {
            &:after {
                border: none;
            }
        }
        .optionsTop {
            padding: 0;
            padding-right: 36rpx;
            height: 135rpx;
        }
    }
</style>
