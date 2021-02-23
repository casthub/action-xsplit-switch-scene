import { PropList, PropType } from '@casthub/types';

export default class extends window.casthub.card.action<{
    scene: string;
}> {
    async mounted(): Promise<void> {
        const { id } = this.identity;

        this.ws = await window.casthub.ws(id);

        await super.mounted();
    }

    async run(): Promise<void> {
        this.ws.send('setActiveScene', {
            id: this.props.scene,
        });
    }

    async prepareProps(): Promise<PropList> {
        let def = '';
        const raw = await this.ws.send('getAllScenes');
        const scenes = raw.reduce((obj, scene) => {
            obj[scene.id] = {
                text: scene.name,
            };

            return obj;
        }, {});

        return {
            scene: {
                type: PropType.Select,
                label: 'Scene',
                default: def,
                options: scenes,
            },
        };
    }
}
