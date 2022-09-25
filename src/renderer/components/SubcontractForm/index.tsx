import { Component } from 'react';
import { FetchApi } from 'renderer/components/Auth';
import InputWrapper from 'renderer/components/InputWrapper';
import MasterForm from 'renderer/components/MasterForm';
import { Data } from 'renderer/pages/MasterPage';

export interface Subcontract {
  id?: string;
  code: string;
  name: string;
  down_payment1: string;
  down_payment2: string;
  down_payment3: string;
}

interface Props {
  fetchApi: FetchApi;
  onClose: () => void;
  onDelete: () => void;
  onSubmit: (data: Data) => Promise<void>;
  subcontract?: Subcontract;
}

interface State {
  subcontract: Subcontract;
}

export default class SubcontractForm extends Component<Props, State> {
  get defaultState() {
    return {
      subcontract: this.props.subcontract ?? {
        name: '',
        code: '',
        down_payment1: '',
        down_payment2: '',
        down_payment3: ''
      }
    };
  }

  constructor(props: Props) {
    super(props);

    this.state = this.defaultState;
  }

  componentDidUpdate(prevProps: Props) {
    if (!!prevProps.subcontract !== !!this.props.subcontract) {
      this.setState(this.defaultState);
    }
  }

  render() {
    const { subcontract } = this.state;
    return (
      <MasterForm<State['subcontract']>
        isEditing={!!subcontract}
        onChange={(key, value) => {
          if (!key) {
            return;
          }

          this.setState({
            subcontract: {
              ...this.state.subcontract,
              [key]: value
            }
          })
        }}
        onClose={this.props.onClose}
        onDelete={this.props.onDelete}
        onSubmit={() => this.props.onSubmit(this.state.subcontract as unknown as Record<string, unknown>)}
        >
        {(errors) => (
          <div>
            <InputWrapper attribute="code" errors={errors}>
              <>
                Subcontract Code:
                <input name="code" type="text" value={this.state.subcontract.code} />
              </>
            </InputWrapper>
            <InputWrapper attribute="name" errors={errors}>
              <>
                Name:
                <input name="name" type="text" value={this.state.subcontract.name} />
              </>
            </InputWrapper>
            <InputWrapper attribute="down_payment1" errors={errors}>
              <>
                Down Payment 1:
                <input name="down_payment1" type="number" min="0" step="0.01" value={this.state.subcontract.down_payment1} />
              </>
            </InputWrapper>
            <InputWrapper attribute="down_payment2" errors={errors}>
              <>
                Down Payment 2:
                <input name="down_payment2" type="number" min="0" step="0.01" value={this.state.subcontract.down_payment2} />
              </>
            </InputWrapper>
            <InputWrapper attribute="down_payment3" errors={errors}>
              <>
                Down Payment 3:
                <input name="down_payment3" type="number" min="0" step="0.01" value={this.state.subcontract.down_payment3} />
              </>
            </InputWrapper>
          </div>
        )}
      </MasterForm>
    );
  }
}
