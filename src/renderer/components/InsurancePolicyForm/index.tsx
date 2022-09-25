import { Component } from 'react';
import { FetchApi } from 'renderer/components/Auth';
import InputWrapper from 'renderer/components/InputWrapper';
import MasterForm, { Resource } from 'renderer/components/MasterForm';
import { Data } from 'renderer/pages/MasterPage';

export interface InsurancePolicy {
  id?: string;
  code: string;
  project_id?: string;
  insurance_company_id?: string;
  details: string;
  comment: string;
  start_date: string;
  end_date: string;
}

interface Props {
  fetchApi: FetchApi;
  insuranceCompanies: Resource[];
  insurancePolicy?: InsurancePolicy;
  onClose: () => void;
  onDelete: () => void;
  onSubmit: (data: Data) => Promise<void>;
  projects: Resource[];
}

interface State {
  insurancePolicy: InsurancePolicy;
}

export default class InsurancePolicyForm extends Component<Props, State> {
  get defaultState() {
    return {
      insurancePolicy: this.props.insurancePolicy ?? {
        code: '',
        project_id: undefined,
        insurance_company_id: undefined,
        details: '',
        comment: '',
        start_date: '',
        end_date: '',
      }
    };
  }

  constructor(props: Props) {
    super(props);

    this.state = this.defaultState;
  }

  render() {
    const { insuranceCompanies, projects  } = this.props;
    const { insurancePolicy } = this.state;
    return (
      <MasterForm<State['insurancePolicy']>
        isEditing={!!insurancePolicy}
        onChange={(key, value) => {
          if (!key) {
            return;
          }

          this.setState({
            insurancePolicy: {
              ...this.state.insurancePolicy,
              [key]: value
            }
          })
        }}
        onClose={this.props.onClose}
        onDelete={this.props.onDelete}
        onSubmit={() => this.props.onSubmit(this.state.insurancePolicy as unknown as Record<string, unknown>)}
      >
        {(errors) => (
          <div>
            <InputWrapper attribute="code" errors={errors}>
              <>
                Policy Code:
                <input name="code" type="text" value={this.state.insurancePolicy.code}/>
              </>
            </InputWrapper>
            <InputWrapper attribute="project_id" errors={errors}>
              <>
                <div>Project:</div>
                <select name="project_id" value={insurancePolicy.project_id}>
                  {MasterForm.renderSelectOptions(projects)}
                </select>
              </>
            </InputWrapper>
            <InputWrapper attribute="insurance_company_id" errors={errors}>
              <>
                <div>Insurance Company:</div>
                <select name="insurance_company_id" value={insurancePolicy.insurance_company_id}>
                  {MasterForm.renderSelectOptions(insuranceCompanies)}
                </select>
              </>
            </InputWrapper>
            <InputWrapper attribute="details" errors={errors}>
              <>
                Policy Details:
                <input name="details" type="text" value={this.state.insurancePolicy.details}/>
              </>
            </InputWrapper>
            <InputWrapper attribute="comment" errors={errors}>
              <>
                Comment:
                <input name="comment" type="text" value={this.state.insurancePolicy.comment}/>
              </>
            </InputWrapper>
            <InputWrapper attribute="start_date" errors={errors}>
              <>
                Start Date:
                <input name="start_date" type="date" value={this.state.insurancePolicy.start_date}/>
              </>
            </InputWrapper>
            <InputWrapper attribute="end_date" errors={errors}>
              <>
                End Date:
                <input name="end_date" type="date" value={this.state.insurancePolicy.end_date}/>
              </>
            </InputWrapper>
          </div>
        )}
      </MasterForm>
    );
  }
}
