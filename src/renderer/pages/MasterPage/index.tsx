import { Component } from 'react';
import { Link } from 'react-router-dom';

import { FetchApi } from 'renderer/components/Auth';
import EmployeeForm, { Employee } from 'renderer/components/EmployeeForm';
import InsuranceCompanyForm, { InsuranceCompany } from 'renderer/components/InsuranceCompanyForm';
import InsurancePolicyForm, { InsurancePolicy } from 'renderer/components/InsurancePolicyForm';
import { Resource as BaseResource } from 'renderer/components/MasterForm';
import PositionForm, { Position } from 'renderer/components/PositionForm';
import ProjectForm, { Project } from 'renderer/components/ProjectForm';
import SubcontractForm, { Subcontract } from 'renderer/components/SubcontractForm';
import singularise from 'renderer/utils/singularise';

import './style.scss';

const resources = ['employees', 'subcontracts', 'positions', 'projects', 'insurance_policies', 'insurance_companies'] as const;

export type Data = Record<string, unknown>;
export type Files = Record<string, File>;
type InFlight = 'creating' | 'error' | 'fetching' | null;
type ResourceName = typeof resources[number];
type Resource = BaseResource & Record<string, unknown>;
type Resources = Map<ResourceName, Resource[]>;

interface Props {
  fetchApi: FetchApi;
  readonly: boolean;
}

interface State {
  activeSubTab: 'new' | 'edit' | 'view';
  activeTab: ResourceName;
  inFlight: InFlight;
  resourceEditing: Resource | null;
  resources: Resources;
}

export default class MasterPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      activeTab: 'employees',
      activeSubTab: props.readonly ? 'view' : 'new',
      inFlight: 'fetching',
      resourceEditing: null,
      resources: new Map()
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.fetchResources();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.activeTab !== this.state.activeTab) {
      this.setState({
        activeSubTab: this.state.activeSubTab === 'edit' ? (this.props.readonly ? 'view' : 'new') : this.state.activeSubTab,
        resourceEditing: null
      });
    }
  }

  async fetchResources() {
    try {
      this.setState({
        inFlight: 'fetching'
      });
      const ret: Resources = new Map();
      await Promise.all(resources.map(async (resourceName) => {
        const response = await this.props.fetchApi('GET', resourceName);
        ret.set(resourceName, response[resourceName]);
      }));
      this.setState({
        inFlight: null,
        resources: ret
      });
    } catch (error) {
      console.error('[master] error while fetching', {
        error
      });
      this.setState({
        inFlight: 'error'
      });
    }
  }

  getTableKeys() {
    switch (this.state.activeTab) {
      case 'employees':
        return ['hired_date', 'code', 'name', 'date_of_birth', 'sex', 'skill'];
      case 'subcontracts':
        return ['code', 'name'];
      case 'projects':
        return ['code', 'name', 'acronym', 'start_date', 'end_date'];
      case 'insurance_policies':
        return ['code', 'start_date', 'end_date', 'details'];
      case 'insurance_companies':
        return ['code', 'name'];
      case 'positions':
        return ['code', 'name', 'minimum_pay', 'maximum_pay'];
    }
  }

  async handleDelete(id: string) {
    await this.props.fetchApi('DELETE', `${this.state.activeTab}/${id}`);
    await this.fetchResources();
  }

  async handleSubmit(data: Data, files: Files = {}) {
    const { activeSubTab, activeTab, resourceEditing } = this.state;
    const method = activeSubTab === 'edit' ? 'PUT' : 'POST';
    const endpoint = activeSubTab === 'edit' ? `${activeTab}/${resourceEditing?.id}` : activeTab
    await this.props.fetchApi(method, endpoint, { [singularise(activeTab)]: data }, {}, files);
    await this.fetchResources();
    this.setState({ activeSubTab: 'view' });
  }

  render() {
    const { readonly } = this.props;
    const { activeSubTab, inFlight, resourceEditing } = this.state;
    if (inFlight === 'fetching') {
      return <div>Loading...</div>;
    }

    if (inFlight === 'error') {
      return <div>An error occurred</div>
    }

    return (
      <div className="MasterPage">
        <div className="backToIndex">
          <Link to="/"><button type="button">Go Back</button></Link>
        </div>
        <div className="tabs">
          {this.renderTab('employees')}
          {this.renderTab('subcontracts')}
          {this.renderTab('projects')}
          {this.renderTab('insurance_policies')}
          {this.renderTab('insurance_companies')}
          {this.renderTab('positions')}
        </div>

        <div className="container">
          <div className="containerTabs">
            {!readonly && (
              <button className={`containerTab newTab ${activeSubTab === 'new' ? 'active' : ''}`} onClick={() => this.setState({ activeSubTab: 'new'})}>New</button>
            )}
            <button className={`containerTab editTab ${activeSubTab === 'edit' ? 'active' : ''}`} disabled={!resourceEditing} onClick={() => this.setState({ activeSubTab: 'edit'})}>{readonly ? 'View One' : 'Edit'}</button>
            <button className={`containerTab viewTab ${activeSubTab === 'view' ? 'active' : ''}`} onClick={() => this.setState({ activeSubTab: 'view' })}>{readonly ? 'View All' : 'View'}</button>
          </div>
          <div className="containerContent">
            {activeSubTab === 'view' ? this.renderTable() : this.renderForm()}
          </div>
        </div>
      </div>
    );
  }

  renderForm() {
    const { readonly } = this.props;
    const { activeSubTab, activeTab, resources, resourceEditing } = this.state;
    if (activeSubTab === 'edit' && !resourceEditing) {
      return (
        <div>Select a record from the view tab first</div>
      );
    }

    switch (activeTab) {
      case 'employees':
        return (
          <EmployeeForm
            employee={this.state.activeSubTab === 'edit' ? this.state.resourceEditing as unknown as Employee : undefined}
            fetchApi={this.props.fetchApi}
            onClose={() => this.setState({
              activeSubTab: 'view',
              resourceEditing: null
            })}
            onDelete={async () => {
              await this.handleDelete(resourceEditing?.id ?? '');
              this.setState({
                activeSubTab: 'view',
                resourceEditing: null
              });
            }}
            onSubmit={this.handleSubmit}
            positions={resources.get('positions') ?? []}
            projects={resources.get('projects') ?? []}
            readonly={readonly}
            subcontracts={resources.get('subcontracts') ?? []}
          />
        );
      case 'insurance_companies':
        return (
          <InsuranceCompanyForm
            fetchApi={this.props.fetchApi}
            insuranceCompany={this.state.activeSubTab === 'edit' ? this.state.resourceEditing as unknown as InsuranceCompany : undefined}
            onClose={() => this.setState({
              activeSubTab: 'view',
              resourceEditing: null
            })}
            onDelete={async () => {
              await this.handleDelete(resourceEditing?.id ?? '');
              this.setState({
                activeSubTab: 'view',
                resourceEditing: null
              });
            }}
            onSubmit={this.handleSubmit}
            readonly={readonly}
          />
        );
      case 'insurance_policies':
        return (
          <InsurancePolicyForm
            fetchApi={this.props.fetchApi}
            insuranceCompanies={resources.get('insurance_companies') ?? []}
            insurancePolicy={this.state.activeSubTab === 'edit' ? this.state.resourceEditing as unknown as InsurancePolicy : undefined}
            onClose={() => this.setState({
              activeSubTab: 'view',
              resourceEditing: null
            })}
            onDelete={async () => {
              await this.handleDelete(resourceEditing?.id ?? '');
              this.setState({
                activeSubTab: 'view',
                resourceEditing: null
              });
            }}
            onSubmit={this.handleSubmit}
            projects={resources.get('projects') ?? []}
            readonly={readonly}
          />
        );
      case 'positions':
        return (
          <PositionForm
            fetchApi={this.props.fetchApi}
            onClose={() => this.setState({
              activeSubTab: 'view',
              resourceEditing: null
            })}
            onDelete={async () => {
              await this.handleDelete(resourceEditing?.id ?? '');
              this.setState({
                activeSubTab: 'view',
                resourceEditing: null
              });
            }}
            onSubmit={this.handleSubmit}
            position={this.state.activeSubTab === 'edit' ? this.state.resourceEditing as unknown as Position : undefined}
            readonly={readonly}
          />
        );
      case 'projects':
        return (
          <ProjectForm
            fetchApi={this.props.fetchApi}
            onClose={() => this.setState({
              activeSubTab: 'view',
              resourceEditing: null
            })}
            onDelete={async () => {
              await this.handleDelete(resourceEditing?.id ?? '');
              this.setState({
                activeSubTab: 'view',
                resourceEditing: null
              });
            }}
            onSubmit={this.handleSubmit}
            project={this.state.activeSubTab === 'edit' ? this.state.resourceEditing as unknown as Project : undefined}
            readonly={readonly}
          />
        );
      case 'subcontracts':
      return (
        <SubcontractForm
          fetchApi={this.props.fetchApi}
          onClose={() => this.setState({
            activeSubTab: 'view',
            resourceEditing: null
          })}
          onDelete={async () => {
            await this.handleDelete(resourceEditing?.id ?? '');
            this.setState({
              activeSubTab: 'view',
              resourceEditing: null
            });
          }}
          onSubmit={this.handleSubmit}
          readonly={readonly}
          subcontract={this.state.activeSubTab === 'edit' ? this.state.resourceEditing as unknown as Subcontract : undefined}
        />
      );
      default:
        return <></>;
    }
  }

  renderTab(name: ResourceName) {
    const label = name
      .replace(/_/g, ' ').split(' ')
      .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
      .join(' ');
    return (
      <button
        className={`tab ${this.state.activeTab === name ? 'active' : ''}`}
        onClick={() => this.setState({ activeTab: name })}
      >
        {label}
      </button>
    );
  }

  renderTable() {
    const resources = this.state.resources.get(this.state.activeTab) ?? [];
    const keys = this.getTableKeys();
    return (
      <div className="tableWrapper">
        <table>
          <thead>
            <tr>
              <th></th>
              {keys.map((key) => <th>{key}</th>)}
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr>
                <td>
                  <button
                    onClick={() => this.setState({
                      activeSubTab: 'edit',
                      resourceEditing: resource
                    })}
                  >{this.props.readonly ? 'View' : 'Edit'}</button>
                  {!this.props.readonly && (
                    <button
                      className="delete"
                      onClick={() => this.handleDelete(resource.id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
                {keys.map((key, index) => {
                  const value = resource[key];
                  return <td key={index}>{typeof value === 'string' ? value : JSON.stringify(value)}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
