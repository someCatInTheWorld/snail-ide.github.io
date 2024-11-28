import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl, intlShape, defineMessages, FormattedMessage} from 'react-intl';
import bindAll from 'lodash.bindall';
import {formatBytes} from '../../lib/tw-bytes-utils';
import downloadBlob from '../../lib/download-blob';
import styles from './ext-manager-modal.css';
import deleteIcon from './delete.svg';
import exportIcon from './export.svg';

const messages = defineMessages({
    delete: {
        // eslint-disable-next-line max-len
        defaultMessage: 'Are you sure you want to delete "{extension}"?',
        description: 'Part of extension management modal. {extension} is deleted.',
        id: 'si.extManager.delete'
    }
});

class ManageExtension extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleExport',
            'handleDelete'
        ]);
    }

    handleExport () {
        const blob = new Blob([this.props.vm.runtime.extensionManager.extensionSources[this.props.ext[0]]], {
            contentType: 'text/javascript'
        });
        downloadBlob(`${this.props.name}.js`, blob);
    }

    handleDelete () {
        // eslint-disable-next-line no-alert
        const allowed = confirm(this.props.intl.formatMessage(messages.delete, {
            extension: this.props.name
        }));
        if (allowed) {
            this.props.vm.extensionManager.removeExtension(this.props.ext[0]);
            this.props.onDeleted();
        }
    }

    render () {
        return (
            <div className={styles.manageExtensions}>
                <div>
                    <div
                        className={styles.manageExtensionsName}
                        title={this.props.name}
                    >
                        {this.props.name}
                    </div>

                    <div className={styles.manageExtensionsDetails}>
                        {this.props.unsandboxed ? 
                            <FormattedMessage
                                defaultMessage="Unsandboxed"
                                description="Part of extension management modal"
                                id="si.extManager.unsandboxed"
                            /> : this.props.sandboxed ? 
                                <FormattedMessage
                                    defaultMessage="Sandboxed"
                                    description="Part of extension management modal"
                                    id="si.extManager.sandboxed"
                                /> : 
                                <FormattedMessage
                                    defaultMessage="Built-in"
                                    description="Part of extension management modal"
                                    id="si.extManager.builtIn"
                                />
                        }
                    </div>
                </div>

                <div className={styles.manageExtensionsButtons}>
                    {this.props.unsandboxed && (
                        <button
                            className={styles.manageExtensionsButton}
                            onClick={this.handleExport}
                        >
                            <img
                                src={exportIcon}
                                alt="Export"
                                draggable={false}
                            />
                        </button>
                    )}

                    <button
                        className={styles.manageExtensionsButton}
                        onClick={this.handleDelete}
                    >
                        <img
                            src={deleteIcon}
                            alt="Delete"
                            draggable={false}
                        />
                    </button>
                </div>
            </div>
        );
    }
}

ManageExtension.propTypes = {
    intl: intlShape,
    name: PropTypes.string.isRequired,
    data: PropTypes.string,
    index: PropTypes.number.isRequired,
    ext: PropTypes.array.isRequired,
    unsandboxed: PropTypes.bool,
    sandboxed: PropTypes.bool,
    onDeleted: PropTypes.func.isRequired,
    vm: PropTypes.func.isRequired
};

export default injectIntl(ManageExtension);
