import { intlShape, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import Box from '../box/box.jsx';
import Modal from '../../containers/modal.jsx';
import styles from './ext-manager-modal.css';

import ManageExtension from './manage-extension.jsx';
import Runtime from 'scratch-vm/src/engine/runtime.js';

class ExtensionsManagerModalComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadedExtensions: []
        };
    };

    componentDidMount() {
        this._generateLoadedExtensions();
    };

    _generateLoadedExtensions() {
        const entriesArray = Array.from(this.props.vm.extensionManager._loadedExtensions);
        entriesArray.forEach(async entry => {
            let name = this.props.vm.runtime["ext_" + entry[0]]["getInfo"]().name;
            if (name === '') name = (await this.props.vm.runtime.extensionManager.getSandboxedExtensionInfo(entry[0])).name
            entry.push(name);
        });
        this.setState({ loadedExtensions: entriesArray });
    };

    render() {
        return (
            <Modal
                className={styles.modalContent}
                onRequestClose={(...args) => {
                    this.props.onClose(...args)
                }}
                contentLabel={"Extension Manager"}
                id="extManagerModal"
            >
                <Box className={classNames(styles.body, Object.keys(this.state.loadedExtensions).length > 0 ? null : styles.centered)}>
                    {Object.keys(this.state.loadedExtensions).length > 0 ? this.state.loadedExtensions.map((ext, i) => {
                        return (
                            <ManageExtension
                                vm={this.props.vm}
                                name={ext[2]}
                                ext={ext}
                                index={i}
                                unsandboxed={ext[1].startsWith('unsandboxed.')}
                                onDeleted={() => {
                                    this._generateLoadedExtensions();
                                }}
                            />
                            // <button key={i} className={styles.button} onClick={() => handleRemoveBtnClick(ext, this.props)}>Remove {this.props.vm.runtime["ext_" + ext[0]]["getInfo"]().name}</button>
                        );
                    }) : (
                        <span>
                            <p><b>No extensions are currently loaded in this project.</b></p>
                            <p>Try loading an extension first, then you can manage them.</p>
                            <p>To load an extension, click the block icon in the bottom left corner and choose an extension.</p>
                        </span>
                    )}
                </Box>
            </Modal>
        );
    };
};

ExtensionsManagerModalComponent.propTypes = {
    intl: intlShape,
    onClose: PropTypes.func,
    vm: PropTypes.shape({
        extensionManager: PropTypes.shape({
            removeExtension: PropTypes.func
        })
    })
};

export default injectIntl(ExtensionsManagerModalComponent);
