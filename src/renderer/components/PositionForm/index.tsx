import { Component } from 'react';
import { FetchApi } from 'renderer/components/Auth';
import InputWrapper from 'renderer/components/InputWrapper';
import MasterForm from 'renderer/components/MasterForm';
import { Data } from 'renderer/pages/MasterPage';

export interface Position {
  id?: string;
  code: string;
  name: string;
  minimum_pay: string;
  maximum_pay: string;
}

interface Props {
  fetchApi: FetchApi;
  onClose: () => void;
  onDelete: () => void;
  onSubmit: (data: Data) => Promise<void>;
  position?: Position;
}

interface State {
  position: Position;
}

export default class PostionForm extends Component<Props, State> {
  get defaultState() {
    return {
      position: this.props.position ?? {
        code: '',
        name: '',
        minimum_pay: '',
        maximum_pay: '',
      }
    };
  }

  constructor(props: Props) {
    super(props);

    this.state = this.defaultState;
  }

  render() {
    const { position } = this.state;
    return (
      <MasterForm<State['position']>
        isEditing={!!position}
        onChange={(key, value) => {
          if (!key) {
            return;
          }

          this.setState({
            position: {
              ...this.state.position,
              [key]: value
            }
          })
        }}
        onClose={this.props.onClose}
        onDelete={this.props.onDelete}
        onSubmit={() => this.props.onSubmit(this.state.position as unknown as Record<string, unknown>)}
        >
          {(errors) => (
            <>
              <div>
                <InputWrapper attribute="code" errors={errors}>
                  <>
                    Position Code:
                    <input name="code" type="text" value={position.code} />
                  </>
                </InputWrapper>
                <InputWrapper attribute="name" errors={errors}>
                  <>
                    Position Name:
                    <input name="name" type="text" value={position.name} />
                  </>
                </InputWrapper>
              </div>
              <div>
                <InputWrapper attribute="minimum_pay" errors={errors}>
                  <>
                    Minimum Rate:
                    <input name="minimum_pay" type="number" min="0" step="0.01" value={position.minimum_pay} />
                  </>
                </InputWrapper>
                <InputWrapper attribute="maximum_pay" errors={errors}>
                  <>
                    Maximum Rate:
                    <input name="maximum_pay" type="number" min="0" step="0.01" value={position.maximum_pay} />
                  </>
                </InputWrapper>
              </div>
            </>
          )}
        </MasterForm>
    );
  }
}
