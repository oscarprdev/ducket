import { Copy } from 'lucide-react';
import { redirect } from 'next/navigation';
import DashboardLayout from '~/components/dashboard-layout';
import ProjectSidebar from '~/components/project-sidebar';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { auth } from '~/server/auth';
import { QUERIES } from '~/server/db/queries';

export default async function ApiKeysPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect('/dashboard');

  const user = session.user;
  const { projects, apiKeys } = await QUERIES.getApiKeysByProject({
    projectId: id,
  });

  const userIsOwner = projects.some(project => project.ownerId === user.id);

  console.log(projects, apiKeys);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">API Keys</h1>
      <Card>
        <CardHeader>
          <CardTitle>Quick Copy</CardTitle>
          <CardDescription>Copy your environment variable to your clipboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-black p-4 font-mono text-sm text-white">
            <div className="flex items-center justify-between">
              {/* <span>DUCKET_API_KEY=&apos;{apiKeys[0].key}&apos;</span> */}
              <Button variant="ghost" size="sm" className="text-white hover:text-white/80">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage your API keys and their permissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last used</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* {[project?.api_key].map(apiKey => (
                <TableRow key={apiKey.id}>
                  <TableCell>{apiKey.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                        {showKeys[apiKey.id] ? apiKey.key : '••••••••••••••••'}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeyVisibility(apiKey.id)}>
                        {showKeys[apiKey.id] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(apiKey.key)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {apiKey.permissions.map(permission => (
                        <span
                          key={permission}
                          className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium">
                          {permission}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(apiKey.created).toLocaleString()}</TableCell>
                  <TableCell>
                    {apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleString() : 'Never'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => copyToClipboard(apiKey.key)}>
                          Copy API Key
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Revoke API Key</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))} */}
            </TableBody>
          </Table>
          <div className="mt-4">
            {/* <Button onClick={() => setIsCreateDialogOpen(true)}>Create API Key</Button> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
