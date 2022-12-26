import { followDoctor } from "@/services/consult";
import type { FollowType } from '@/types/consult'
import { ref } from "vue";

export const useFollow = (type: FollowType) => {
    const loading = ref(false);
    const follow = async (item) => {
        loading.value = true;
        await followDoctor(item.id);
        item.likeFlag = item.likeFlag === 1 ? 0 : 1;
        loading.value = false;
    };
    return { loading, follow }
}
