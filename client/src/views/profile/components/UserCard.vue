<template>
    <el-card style="margin-bottom: 20px">
        <div slot="header" class="clearfix">
            <span>个人中心</span>
        </div>

        <div class="user-profile">
            <div class="box-center">
                <pan-thumb
                    :image="downloadFileUrl + user.avatar"
                    :height="'100px'"
                    :width="'100px'"
                    :hoverable="false"
                >
                    <div>{{ user.roleName }}</div>
                    {{ user.roleName }}
                </pan-thumb>
            </div>
            <div class="box-center">
                <div class="user-name text-center">{{ user.name }}</div>
                <div class="user-role text-center text-muted">
                    {{ user.roleName }}
                </div>
            </div>
        </div>
    </el-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { IProfile } from "../index.vue";
import PanThumb from "@/components/PanThumb/index.vue";
import { downloadFileUrl } from "@/api/common/common";

@Component({
    name: "UserCard",
    components: {
        PanThumb,
    },
})
export default class extends Vue {
    private downloadFileUrl = downloadFileUrl;
    @Prop({ required: true }) private user!: IProfile;
}
</script>

<style lang="scss" scoped>
.box-center {
    margin: 0 auto;
    display: table;
}

.text-muted {
    color: #777;
}

.user-profile {
    .user-name {
        font-weight: bold;
    }

    .box-center {
        padding-top: 10px;
    }

    .user-role {
        padding-top: 10px;
        font-weight: 400;
        font-size: 14px;
    }

    .box-social {
        padding-top: 30px;

        .el-table {
            border-top: 1px solid #dfe6ec;
        }
    }

    .user-follow {
        padding-top: 20px;
    }
}

.user-bio {
    margin-top: 20px;
    color: #606266;

    span {
        padding-left: 4px;
    }

    .user-bio-section {
        font-size: 14px;
        padding: 15px 0;

        .user-bio-section-header {
            border-bottom: 1px solid #dfe6ec;
            padding-bottom: 10px;
            margin-bottom: 10px;
            font-weight: bold;
        }
    }
}
</style>
