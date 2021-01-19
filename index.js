module.exports = class extends window.casthub.card.action {

    /**
     * @return {Promise}
     */
    async mounted() {
        const { id } = this.identity;

        // Open the WebSocket Connection to XSplit Broadcaster.
        this.ws = await window.casthub.ws(id);

        await super.mounted();
    }

    /**
     * @param {Object} input
     */
    async run(input) {
        this.ws.send('setActiveScene', {
            id: this.props.scene,
        });
    }

    /**
     * @return {Promise}
     */
    async prepareProps() {
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
                type: 'select',
                label: 'Scene',
                default: def,
                options: scenes,
            },
        };
    }

};
