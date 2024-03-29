import { Secret } from "../secret.model";

export const MySqlServer: Secret = {
  category: "Sql",
  customAttributes: {},
  description: "Sql connection data",
  displayName: "MySQL Server secret",
  inputProperties: [
    {
      disableWorkflowProviderSelection: false,
      isBrowsable: true,
      isReadOnly: false,
      label: "Server",
      name: "server",
      order: 0,
      supportedSyntaxes: ["JavaScript", "Liquid"],
      type: "System.String",
      uiHint: "single-line",
    },
    {
      disableWorkflowProviderSelection: false,
      isBrowsable: true,
      isReadOnly: false,
      label: "Port",
      name: "port",
      order: 0,
      supportedSyntaxes: ["JavaScript", "Liquid"],
      type: "System.Int64",
      uiHint: "single-line",
    },
    {
      disableWorkflowProviderSelection: false,
      isBrowsable: true,
      isReadOnly: false,
      label: "Database",
      name: "database",
      order: 0,
      supportedSyntaxes: ["JavaScript", "Liquid"],
      type: "System.String",
      uiHint: "single-line",
    },
    {
      disableWorkflowProviderSelection: false,
      isBrowsable: true,
      isReadOnly: false,
      label: "User ID",
      name: "user id",
      order: 0,
      supportedSyntaxes: ["JavaScript", "Liquid"],
      type: "System.String",
      uiHint: "single-line",
    },
    {
      disableWorkflowProviderSelection: false,
      isBrowsable: true,
      isReadOnly: false,
      label: "Password",
      name: "password",
      order: 0,
      supportedSyntaxes: ["JavaScript", "Liquid"],
      type: "System.String",
      uiHint: "single-line",
    },
    {
      disableWorkflowProviderSelection: false,
      isBrowsable: true,
      isReadOnly: false,
      label: "Allow Load Local Infile",
      name: "AllowLoadLocalInfile",
      order: 0,
      supportedSyntaxes: ["JavaScript", "Liquid"],
      type: "System.String",
      uiHint: "single-line",
    },
    {
      disableWorkflowProviderSelection: false,
      isBrowsable: true,
      isReadOnly: false,
      label: "SSL Mode",
      name: "SSL Mode",
      order: 0,
      supportedSyntaxes: ["JavaScript", "Liquid"],
      type: "System.String",
      uiHint: "single-line",
    },
    {
      disableWorkflowProviderSelection: false,
      isBrowsable: true,
      isReadOnly: false,
      label: "SSL Mode",
      name: "SSL Mode",
      order: 0,
      supportedSyntaxes: ["JavaScript", "Liquid"],
      type: "System.String",
      uiHint: "single-line",
    },
    {
      disableWorkflowProviderSelection: false,
      isBrowsable: true,
      isReadOnly: false,
      label: "Certificate File",
      name: "CertificateFile",
      order: 0,
      supportedSyntaxes: ["JavaScript", "Liquid"],
      type: "System.String",
      uiHint: "single-line",
    },
    {
      disableWorkflowProviderSelection: false,
      isBrowsable: true,
      isReadOnly: false,
      label: "Certificate Password",
      name: "CertificatePassword",
      order: 0,
      supportedSyntaxes: ["JavaScript", "Liquid"],
      type: "System.String",
      uiHint: "single-line",
    },
    {
      disableWorkflowProviderSelection: false,
      isBrowsable: true,
      isReadOnly: false,
      label: "Use Affected Rows",
      name: "UseAffectedRows",
      order: 0,
      supportedSyntaxes: ["JavaScript", "Liquid"],
      type: "System.String",
      uiHint: "single-line",
    },
    {
      disableWorkflowProviderSelection: false,
      isBrowsable: true,
      isReadOnly: false,
      label: "Use Compression",
      name: "UseCompression",
      order: 0,
      supportedSyntaxes: ["JavaScript", "Liquid"],
      type: "System.String",
      uiHint: "single-line",
    },
    {
      disableWorkflowProviderSelection: false,
      isBrowsable: true,
      isReadOnly: false,
      label: "Pooling",
      name: "Pooling",
      order: 0,
      supportedSyntaxes: ["JavaScript", "Liquid"],
      type: "System.String",
      uiHint: "single-line",
    },
    {
      disableWorkflowProviderSelection: false,
      isBrowsable: true,
      isReadOnly: false,
      label: "Integrated Security",
      name: "IntegratedSecurity",
      order: 0,
      supportedSyntaxes: ["JavaScript", "Liquid"],
      type: "System.String",
      uiHint: "single-line",
    },
    {
      disableWorkflowProviderSelection: false,
      isBrowsable: true,
      isReadOnly: false,
      label: "Connection Timeout",
      name: "Connection Timeout",
      order: 0,
      supportedSyntaxes: ["JavaScript", "Liquid"],
      type: "System.Int64",
      uiHint: "single-line",
    },
  ],
  type: "MySQLServer"
}
