{ pkgs, ... }: {
  channel = "stable-24.11";

  packages = [
    pkgs.nodejs_22
  ];

  idx = {
    previews = {
      enable = true;
      previews = {
        web = {
          command = [
            "npm"
            "run"
            "dev"
            "--"
            "--hostname"
            "0.0.0.0"
            "--port"
            "$PORT"
          ];
          manager = "web";
        };
      };
    };
  };
}